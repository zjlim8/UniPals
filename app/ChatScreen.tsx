import React, { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ChatScreen() {
  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "Welcome to University FriendFinder!",
      sender: "bot",
    },
  ]);
  const [inputText, setInputText] = useState("");

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: "me", // You can replace this with user UID
    };

    setMessages([newMessage, ...messages]);
    setInputText("");
  };

  const renderItem = ({ item }) => (
    <View
      style={{
        alignSelf: item.sender === "me" ? "flex-end" : "flex-start",
        backgroundColor: item.sender === "me" ? "#DCF8C6" : "#EEE",
        borderRadius: 10,
        marginVertical: 4,
        padding: 10,
        maxWidth: "75%",
      }}
    >
      <Text>{item.text}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, padding: 10, backgroundColor: "white" }}
      keyboardVerticalOffset={80}
    >
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        inverted
        contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end" }}
      />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 10,
          borderTopWidth: 1,
          borderColor: "#DDD",
        }}
      >
        <TextInput
          style={{
            flex: 1,
            borderColor: "#CCC",
            borderWidth: 1,
            borderRadius: 20,
            paddingHorizontal: 15,
            paddingVertical: 8,
            marginRight: 10,
          }}
          placeholder="Type a message"
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity
          onPress={sendMessage}
          style={{
            backgroundColor: "#6200ee",
            padding: 10,
            borderRadius: 20,
          }}
        >
          <Text style={{ color: "white" }}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
