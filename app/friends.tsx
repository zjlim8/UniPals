import { db } from "@/firebaseSetup";
import { navigateToChat } from "@/utils/chat";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
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
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";

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

  function handleMessage(friendId: string): void {
    if (!currentUser) return;

    const friend = friends.find((f) => f.id === friendId);
    if (!friend) return;

    navigateToChat(currentUser.uid, {
      id: friend.id,
      firstName: friend.firstName,
      lastName: friend.lastName,
      photoURL: friend.photoURL,
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
          source={{
            uri:
              item.photoURL ||
              "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg",
          }}
          style={{ width: 48, height: 48, borderRadius: 24, marginRight: 12 }}
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
      // Find the friendship document by querying for it
      const friendsQuery = query(
        collection(db, "friends"),
        where("users", "array-contains", currentUser.uid)
      );

      const friendsSnapshot = await getDocs(friendsQuery);

      // Find the specific friendship document with this friend
      const friendshipDoc = friendsSnapshot.docs.find((doc) => {
        const users = doc.data().users;
        return users.includes(friendId);
      });

      if (friendshipDoc) {
        // Delete the found document
        await deleteDoc(doc(db, "friends", friendshipDoc.id));

        // Update local state
        setFriends((prev) => prev.filter((friend) => friend.id !== friendId));

        Alert.alert("Success", "Friend removed successfully");
      } else {
        Alert.alert("Error", "Friendship not found");
      }
    } catch (error) {
      console.error("Error removing friend:", error);
      Alert.alert("Error", "Failed to remove friend");
    }
  };

  return (
    <View className="flex-1 bg-background pt-[60]">
      <View className="flex-row items-center mb-2">
        <TouchableOpacity onPress={() => router.back()} className="mx-4">
          <Ionicons name="chevron-back" size={24} color="#3B82F6" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-headingtext">Friends</Text>
      </View>
      <FlatList
        data={friends}
        renderItem={renderFriend}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default Friends;
