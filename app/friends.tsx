import { db } from "@/firebase";
import { router } from "expo-router";
import { getAuth } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Friend = {
  id: string;
  firstName: string;
  lastName: string;
  photoURL?: string;
  course?: string;
  semester?: string;
  friendshipDate: any;
};

const Friends = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const currentUser = getAuth().currentUser;

  useEffect(() => {
    fetchFriends();
  }, []);

  function handleViewProfile(id: string): void {
    router.push({
      pathname: "/profile",
      params: { userId: id },
    });
  }

  function handleMessage(id: string): void {
    router.push({
      pathname: "/chatscreen",
      params: {
        chatId: [currentUser?.uid, id].sort().join("_"),
        recipient: JSON.stringify({
          id: id,
          firstName: friends.find((f) => f.id === id)?.firstName,
          lastName: friends.find((f) => f.id === id)?.lastName,
          photoURL: friends.find((f) => f.id === id)?.photoURL,
        }),
      },
    });
  }

  const fetchFriends = async () => {
    if (!currentUser) return;

    try {
      const friendsQuery = query(
        collection(db, "friends"),
        where("users", "array-contains", currentUser.uid)
      );

      const friendsSnapshot = await getDocs(friendsQuery);

      const friendsData = await Promise.all(
        friendsSnapshot.docs.map(async (docSnapshot) => {
          const friendId = docSnapshot
            .data()
            .users.find((id: string) => id !== currentUser.uid);
          const friendDoc = await getDoc(doc(db, "users", friendId));
          const friendData = friendDoc.data();

          if (!friendData) {
            throw new Error("Friend data not found");
          }

          return {
            id: friendId,
            firstName: friendData.firstName,
            lastName: friendData.lastName,
            photoURL: friendData.photoURL,
            course: friendData.course,
            semester: friendData.semester,
            friendshipDate: docSnapshot.data().timestamp,
          } as Friend;
        })
      );

      setFriends(friendsData);
    } catch (error) {
      console.error("Error fetching friends:", error);
      Alert.alert("Error", "Failed to fetch friends");
    }
  };

  const renderFriend = ({ item }: { item: Friend }) => (
    <View className="flex-row items-center px-4 py-3 border-b border-gray-200">
      <TouchableOpacity
        className="flex-1 flex-row"
        onPress={() => handleViewProfile(item.id)}
      >
        <Image
          source={{ uri: item.photoURL || "https://i.pravatar.cc/100?img=1" }}
          className="w-12 h-12 rounded-full mr-3"
        />
        <View className="flex-1">
          <Text className="font-semibold text-base">
            {item.firstName} {item.lastName}
          </Text>
          <Text className="text-gray-500 text-sm">
            {item.course} - Semester {item.semester}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleMessage(item.id)}
        className="bg-primary px-3 py-1 rounded-[15]"
      >
        <Text className="text-white text-sm text-center self-center">
          Message
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-white pt-12">
      <Text className="text-2xl font-bold px-4 pb-2 text-blue-600">
        Friends
      </Text>
      <FlatList
        data={friends}
        renderItem={renderFriend}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default Friends;
