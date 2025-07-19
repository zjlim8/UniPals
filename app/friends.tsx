import { db } from "@/firebase";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { getAuth } from "firebase/auth";
import {
  collection,
  deleteDoc,
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
      <View className="flex-row gap-2">
        <TouchableOpacity
          onPress={() => handleMessage(item.id)}
          className="bg-primary px-3 py-1 rounded-[15]"
        >
          <Text className="text-white text-sm text-center self-center">
            Message
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleUnfriend(item.id)}
          className="bg-red-500 w-8 h-8 rounded-full items-center justify-center"
        >
          <MaterialCommunityIcons
            name="account-remove"
            size={18}
            color="white"
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleUnfriend = async (friendId: string) => {
    if (!currentUser) return;

    try {
      // Delete the friend connection document
      const friendDocId = [currentUser.uid, friendId].sort().join("_");
      await deleteDoc(doc(db, "friends", friendDocId));

      // Update local state
      setFriends((prev) => prev.filter((friend) => friend.id !== friendId));

      Alert.alert("Success", "Friend removed successfully");
    } catch (error) {
      console.error("Error removing friend:", error);
      Alert.alert("Error", "Failed to remove friend");
    }
  };

  return (
    <View className="flex-1 bg-background pt-[60]">
      <Text className="text-2xl font-bold px-4 pb-2 text-primary">Friends</Text>
      <FlatList
        data={friends}
        renderItem={renderFriend}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default Friends;
