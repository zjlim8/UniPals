import { db } from "@/firebase";
import { useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";

const createChatId = (uid1, uid2) => [uid1, uid2].sort().join("_");

export default function chat() {
  const [chatPreviews, setChatPreviews] = useState([]);
  const currentUser = getAuth().currentUser;
  const navigation = useNavigation();

  useEffect(() => {
    const fetchChats = async () => {
      const q = query(
        collection(db, "chats"),
        where("users", "array-contains", currentUser.uid),
        orderBy("lastTimestamp", "desc")
      );
      const snapshot = await getDocs(q);

      const previewData = [];

      for (const docSnap of snapshot.docs) {
        const chat = docSnap.data();
        const otherUserId = chat.users.find((uid) => uid !== currentUser.uid);
        const userSnap = await getDoc(doc(db, "users", otherUserId));
        const user = userSnap.data();

        previewData.push({
          id: docSnap.id,
          otherUser: { ...user, id: userSnap.id },
          lastMessage: chat.lastMessage,
          unread: chat.unreadBy?.includes(currentUser.uid),
        });
      }

      setChatPreviews(previewData);
    };

    fetchChats();
  }, []);

  const handleStartChat = async (recipient) => {
    const chatId = createChatId(currentUser.uid, recipient.id);
    const chatRef = doc(db, "chats", chatId);
    const chatSnap = await getDoc(chatRef);

    if (!chatSnap.exists()) {
      await setDoc(chatRef, {
        users: [currentUser.uid, recipient.id],
        lastMessage: "",
        lastTimestamp: serverTimestamp(),
        unreadBy: [],
      });
    }

    navigation.navigate("chatscreen", {
      chatId,
      recipient,
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      className="flex-row items-center px-4 py-3 border-b border-gray-200"
      onPress={() => handleStartChat(item.otherUser)}
    >
      <Image
        source={{
          uri: item.otherUser.photoURL || "https://i.pravatar.cc/100?img=1",
        }}
        className="w-12 h-12 rounded-full mr-3"
      />
      <View className="flex-1">
        <Text className="text-base font-semibold">
          {item.otherUser.fullName}
        </Text>
        <Text className="text-gray-500 text-sm" numberOfLines={1}>
          {item.lastMessage || "Say hi 👋"}
        </Text>
      </View>
      {item.unread && (
        <View className="bg-blue-600 rounded-full w-5 h-5 items-center justify-center">
          <Text className="text-white text-xs">1</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-white pt-12">
      <Text className="text-2xl font-bold px-4 pb-2 text-blue-600">
        Messages
      </Text>
      <FlatList
        data={chatPreviews}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}
