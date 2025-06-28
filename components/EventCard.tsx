import React from "react";
import { Text } from "react-native";
import { Card } from "react-native-paper";

interface EventCardProps {
  imageUrl: string;
  title: string;
  description: string;
}

export default function EventCard(props: EventCardProps) {
  return (
    <Card
      mode="elevated"
      style={{ backgroundColor: "#FFFFFF", width: "100%" }}
      theme={{ colors: { primary: "#3B82F6" } }}
    >
      <Card.Cover source={{ uri: props.imageUrl }} />
      <Card.Title
        title={props.title}
        titleStyle={{ color: "#323232", fontWeight: "bold" }}
      />
      <Card.Content style={{ marginTop: -10 }}>
        <Text className="text-bodytext text-justify">{props.description}</Text>
      </Card.Content>
    </Card>
  );
}
