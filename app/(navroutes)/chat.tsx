import { db } from "@/firebaseSetup";
import { navigateToChat } from "@/utils/chat";
import { getAuth } from "firebase/auth";

import { Image } from "expo-image";
import {
  collection,
  doc,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Searchbar } from "react-native-paper";

type ChatPreview = {
  id: string;
  recipient: {
    id: string;
    firstName: string;
    lastName: string;
    photoURL?: string;
  };
  lastMessage?: string;
  timestamp: any;
};

export default function Chat() {
  const [chats, setChats] = useState<ChatPreview[]>([]);
  const [filteredChats, setFilteredChats] = useState<ChatPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const currentUser = getAuth().currentUser;

  useEffect(() => {
    if (!currentUser) return;

    setLoading(true);

    const unsubscribeMessagesMap: { [chatId: string]: () => void } = {};
    let initLoadCount = 0;
    let totalChats = 0;

    const unsubscribeFriends = onSnapshot(
      query(
        collection(db, "friends"),
        where("users", "array-contains", currentUser.uid)
      ),
      async (friendsSnapshot) => {
        const chatDocs = friendsSnapshot.docs;
        totalChats = chatDocs.length;

        if (totalChats === 0) {
          setChats([]);
          setFilteredChats([]);
          setLoading(false);
          return;
        }

        chatDocs.forEach(async (docSnapshot) => {
          const chatId = docSnapshot.id;
          const otherUserId = docSnapshot
            .data()
            .users.find((uid: string) => uid !== currentUser.uid);

          const userDoc = await getDoc(doc(db, "users", otherUserId));
          const userData = userDoc.data();

          const unsubscribeMessages = onSnapshot(
            query(
              collection(db, "chats", chatId, "messages"),
              orderBy("timestamp", "desc"),
              limit(1)
            ),
            (messagesSnap) => {
              const lastMessage = messagesSnap.docs[0]?.data();

              setChats((prevChats) => {
                const updatedChat = {
                  id: chatId,
                  recipient: {
                    id: otherUserId,
                    firstName: userData?.firstName || "",
                    lastName: userData?.lastName || "",
                    photoURL: userData?.photoURL,
                  },
                  lastMessage: lastMessage?.text
                    ? `${
                        lastMessage.senderId === currentUser.uid ? "You: " : ""
                      }${lastMessage.text}`
                    : "No messages yet",
                  timestamp:
                    lastMessage?.timestamp || docSnapshot.data().timestamp,
                };

                const others = prevChats.filter((c) => c.id !== chatId);
                const sorted = [...others, updatedChat].sort(
                  (a, b) => b.timestamp?.seconds - a.timestamp?.seconds
                );

                return sorted;
              });

              // Once first message snapshot is processed, count it
              initLoadCount++;
              if (initLoadCount === totalChats) {
                setLoading(false);
              }
            }
          );

          unsubscribeMessagesMap[chatId] = unsubscribeMessages;
        });
      }
    );

    return () => {
      unsubscribeFriends();
      Object.values(unsubscribeMessagesMap).forEach((unsub) => unsub());
    };
  }, [currentUser]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredChats(chats);
      return;
    }

    const searchTerm = searchQuery.toLowerCase();
    const filtered = chats.filter(
      (chat) =>
        chat.recipient.firstName.toLowerCase().includes(searchTerm) ||
        chat.recipient.lastName.toLowerCase().includes(searchTerm)
    );
    setFilteredChats(filtered);
  }, [searchQuery, chats]);

  const handleChatPress = (chat: ChatPreview) => {
    if (currentUser) {
      navigateToChat(currentUser.uid, chat.recipient);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white pt-[60]">
      <Text className="text-2xl font-bold px-4 pb-2 text-primary">Chats</Text>
      {/* Search Bar */}
      <View className="px-4 mb-2">
        <Searchbar
          placeholder="Search chats"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={{
            backgroundColor: "#FFFFFF",
            borderWidth: 1,
            borderRadius: 8,
            borderColor: "#90A4AE",
            width: "100%",
          }}
          inputStyle={{
            color: "#5C5C5C",
          }}
          placeholderTextColor="#90A4AE"
          iconColor="#90A4AE"
          onBlur={Keyboard.dismiss}
        />
      </View>
      {filteredChats.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          {searchQuery.trim() !== "" ? (
            <Text className="text-bodytext text-center">
              No chats match your search
            </Text>
          ) : (
            <Text className="text-bodytext text-center">
              No conversations yet.{"\n"}Add friends to start chatting!
            </Text>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredChats}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleChatPress(item)}
              className="flex-row items-center px-4 py-3 border-b border-gray-200"
            >
              <Image
                source={{
                  uri:
                    item.recipient.photoURL ||
                    "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg",
                }}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  marginRight: 12,
                }}
              />
              <View className="flex-1">
                <Text className="font-semibold text-base">
                  {item.recipient.firstName} {item.recipient.lastName}
                </Text>
                <Text className="text-gray-500 text-sm" numberOfLines={1}>
                  {item.lastMessage}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}
