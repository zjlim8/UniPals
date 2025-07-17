import { db } from "@/firebase";
import { useRoute } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");

  const route = useRoute();
  const { chatId } = route.params;
  const currentUser = getAuth().currentUser;

  useEffect(() => {
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(loadedMessages.reverse()); // For inverted FlatList
    });

    return () => unsubscribe();
  }, [chatId]);

  const sendMessage = async () => {
    if (!currentUser) {
      Alert.alert("No user is currently logged in.");
      return;
    }
    if (!inputText.trim()) return;

    await addDoc(collection(db, "chats", chatId, "messages"), {
      senderId: currentUser.uid,
      text: inputText,
      timestamp: serverTimestamp(),
    });

    setInputText("");
  };

  const renderItem = ({ item }) => {
    if (!currentUser) {
      Alert.alert("No user is currently logged in.");
      return;
    }
    const isMe = item.senderId === currentUser.uid;

    return (
      <View
        className={`rounded-xl px-4 py-2 my-1 max-w-[75%] ${
          isMe ? "bg-green-200 self-end" : "bg-gray-200 self-start"
        }`}
      >
        <Text className="text-base">{item.text}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-white px-3"
      keyboardVerticalOffset={80}
    >
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        inverted
        contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end" }}
      />

      <View className="flex-row items-center px-3 py-2 border-t border-gray-300">
        <TextInput
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 mr-2 text-base"
          placeholder="Type a message"
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity
          onPress={sendMessage}
          className="bg-indigo-600 rounded-full px-4 py-2"
        >
          <Text className="text-white text-sm font-medium">Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
