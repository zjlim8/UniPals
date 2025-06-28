import React from "react";
import { FlatList, Image, Text, View } from "react-native";
import { IconButton } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

// Example messages data
const messages = [
  { id: "1", text: "Hello!", sender: "Alice" },
  { id: "2", text: "Hi there!", sender: "Bob" },
  { id: "3", text: "How are you?", sender: "Alice" },
];

const MessageItem = ({
  item,
}: {
  item: { id: string; text: string; sender: string };
}) => (
  <View className="flex-row items-center px-4 py-2">
    <Image
      source={{ uri: "https://i.pravatar.cc/100?img=2" }}
      className="w-8 h-8 rounded-full mr-3"
    />
    <View>
      <Text className="font-semibold">{item.sender}</Text>
      <Text>{item.text}</Text>
    </View>
  </View>
);

const Chat = () => {
  return (
    <SafeAreaView className="bg-background h-full">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-2 pb-3">
        <View className="flex-row items-center space-x-3">
          <Image
            source={{ uri: "https://i.pravatar.cc/100?img=1" }}
            className="w-12 h-12 rounded-full mr-3"
          />
          <Text className="text-2xl font-bold text-primary">Messages</Text>
        </View>
        <IconButton icon="magnify" size={24} />
      </View>

      {/* Messages List */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MessageItem item={item} />}
      />
    </SafeAreaView>
  );
};

export default Chat;
