import EventCard from "@/components/EventCard";
import React from "react";
import { Keyboard, ScrollView, View } from "react-native";
import { Searchbar } from "react-native-paper";

const Events = () => {
  const [searchQuery, setSearchQuery] = React.useState("");

  return (
    <View className="screen flex-1">
      <Searchbar
        placeholder="Search"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={{
          backgroundColor: "#FFFFFF",
          borderWidth: 1,
          borderRadius: 12,
          borderColor: "#90A4AE",
          width: "100%",
          marginBottom: 20,
        }}
        onBlur={Keyboard.dismiss}
      />
      <ScrollView
        className="w-full flex-1"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="w-full gap-8 px-1">
          <EventCard
            imageUrl="https://picsum.photos/700"
            title="Card Title"
            description="Lorem ipsum dolor sit amet"
          />
          <EventCard
            imageUrl="https://picsum.photos/700"
            title="Card Title"
            description="Lorem ipsum dolor sit amet"
          />
          <EventCard
            imageUrl="https://picsum.photos/700"
            title="Card Title"
            description="Lorem ipsum dolor sit amet"
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default Events;
