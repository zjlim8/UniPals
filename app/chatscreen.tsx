import { db } from "@/firebaseSetup";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";

type Message = {
  id: string;
  text: string;
  senderId: string;
  timestamp: any;
};

export default function ChatScreen() {
  const params = useLocalSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  const currentUser = getAuth().currentUser;
  const chatId = params.chatId as string;
  const recipient = JSON.parse(params.recipient as string);

  useEffect(() => {
    if (!currentUser || !chatId) return;

    // Subscribe to messages
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messageList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[];
      setMessages(messageList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [chatId]);

  const sendMessage = async () => {
    if (!inputText.trim() || !currentUser || !chatId) return;

    try {
      await addDoc(collection(db, "chats", chatId, "messages"), {
        text: inputText.trim(),
        senderId: currentUser.uid,
        timestamp: serverTimestamp(),
      });

      setInputText("");
    } catch (error) {
      console.error("Error sending message:", error);
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
      keyboardVerticalOffset={90}
    >
      {/* Header */}
      <View className="flex-row items-center p-4 pt-[60] border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="chevron-back" size={24} color="#3B82F6" />
        </TouchableOpacity>
        <Image
          source={{
            uri:
              recipient.photoURL ||
              "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg",
          }}
          className="w-10 h-10 rounded-full mr-3"
        />
        <Text className="text-lg font-semibold">
          {recipient.firstName} {recipient.lastName}
        </Text>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        inverted
        className="flex-1 px-4"
        renderItem={({ item }) => {
          const isMine = item.senderId === currentUser?.uid;
          return (
            <View
              className={`flex-row ${
                isMine ? "justify-end" : "justify-start"
              } mb-2`}
            >
              <View
                className={`rounded-2xl px-4 py-2 max-w-[80%] ${
                  isMine ? "bg-primary" : "bg-gray-200"
                }`}
              >
                <Text
                  className={`text-base ${
                    isMine ? "text-white" : "text-gray-800"
                  }`}
                >
                  {item.text}
                </Text>
              </View>
            </View>
          );
        }}
        keyExtractor={(item) => item.id}
      />

      {/* Input */}
      <View className="flex-row items-center p-4 pb-[35] border-t border-gray-200">
        <TextInput
          className="flex-1 h-12 bg-gray-100 rounded-full px-4 mr-2"
          placeholder="Type a message..."
          placeholderTextColor="#5C5C5C"
          value={inputText}
          onChangeText={setInputText}
          style={{
            paddingTop: 12,
            paddingBottom: 10,
          }}
          multiline
        />
        <TouchableOpacity
          onPress={sendMessage}
          disabled={!inputText.trim()}
          className={`rounded-full p-2 h-12 items-center justify-center ${
            inputText.trim() ? "bg-primary" : "bg-gray-300"
          }`}
        >
          <Text className="text-white px-3">Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
