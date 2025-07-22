import { sendFriendRequest } from "@/utils/friendrequest";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { getAuth } from "firebase/auth";
import React, { useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { useRecommendedFriends } from "./recommendedusers";

type RecommendedUser = {
  id: string;
  firstName: string;
  lastName: string;
  photoURL?: string;
  course?: string;
  semester?: string;
  matchScore?: number;
  sharedInterests?: string[];
};

const People = () => {
  const [sentRequests, setSentRequests] = useState<string[]>([]);
  const currentUser = getAuth().currentUser;
  const { recommendations, loading } = useRecommendedFriends();

  function handleViewProfile(id: string): void {
    router.push({
      pathname: "/profile",
      params: { userId: id },
    });
  }

  const handleSendFriendRequest = async (targetUid: string) => {
    if (!currentUser) return;

    const success = await sendFriendRequest(currentUser.uid, targetUid);
    if (success) {
      setSentRequests((prev) => [...prev, targetUid]);
    }
  };

  const renderPerson = ({ item }: { item: RecommendedUser }) => {
    const isRequestSent = sentRequests.includes(item.id);

    return (
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
            contentFit="cover"
          />
          <View className="flex-1">
            <Text className="font-semibold text-base">
              {item.firstName} {item.lastName}
            </Text>
            <Text className="text-gray-500 text-sm">
              {item.course || "Unknown course"} - Semester{" "}
              {item.semester || "N/A"}
            </Text>
            {item.sharedInterests && item.sharedInterests.length > 0 && (
              <Text className="text-primary text-xs mt-1">
                {item.sharedInterests.length} shared interest
                {item.sharedInterests.length > 1 ? "s" : ""}
              </Text>
            )}
          </View>
        </TouchableOpacity>
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={() => handleSendFriendRequest(item.id)}
            disabled={isRequestSent}
            className={`px-3 py-1 rounded-[15] ${
              isRequestSent ? "bg-gray-400" : "bg-primary"
            }`}
          >
            <Text className="text-white text-sm text-center self-center">
              {isRequestSent ? "Sent" : "Add Friend"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <Text className="text-lg">Loading recommendations...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background pt-[60]">
      <View className="flex-row items-center mb-2">
        <TouchableOpacity onPress={() => router.back()} className="mx-4">
          <Ionicons name="chevron-back" size={24} color="#3B82F6" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-headingtext">
          Discover People
        </Text>
      </View>

      {recommendations.length === 0 ? (
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-lg font-semibold text-center mb-2">
            No recommendations available
          </Text>
          <Text className="text-gray-500 text-center">
            Complete your profile to get better recommendations!
          </Text>
        </View>
      ) : (
        <FlatList
          data={recommendations.map((user) => ({
            ...user,
            semester: user.semester ? String(user.semester) : "N/A",
          }))}
          renderItem={renderPerson}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default People;
