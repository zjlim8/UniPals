import React from "react";
import { Text } from "react-native";
import { Card } from "react-native-paper";

interface EventCardProps {
  imageUrl: string;
  title: string;
  description: string;
  button?: React.ReactNode;
  cardWidth?: number | `${number}%` | "auto";
}

export default function CustomCard(props: EventCardProps) {
  return (
    <Card
      mode="elevated"
      style={{
        backgroundColor: "#FFFFFF",
        ...(props.cardWidth !== undefined ? { width: props.cardWidth } : {}),
      }}
      theme={{ colors: { primary: "#3B82F6" } }}
    >
      <Card.Cover
        source={{ uri: props.imageUrl }}
        resizeMode="cover"
        style={{ height: 300 }}
      />
      <Card.Title
        title={props.title}
        titleStyle={{ color: "#323232", fontWeight: "bold" }}
        titleNumberOfLines={0}
      />
      <Card.Content style={{ marginTop: 0 }}>
        <Text className="text-bodytext text-justify">{props.description}</Text>
        {props.button && <>{props.button}</>}
      </Card.Content>
    </Card>
  );
}
