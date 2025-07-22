import CustomCard from "@/components/CustomCard";
import { db } from "@/firebaseSetup"; // Add this import
import { handleLogout } from "@/utils/auth";
import { sendFriendRequest } from "@/utils/friendrequest";
import { Image } from "expo-image";
import { router } from "expo-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; // Add this import
import React, { useEffect, useState } from "react";
import {
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Card } from "react-native-paper";
import { useRecommendedFriends } from "../recommendedusers";

type User = {
  id: string;
  [key: string]: any;
};

// Add type for user profile
type UserProfile = {
  firstName: string;
  lastName: string;
  course?: string;
  semester?: string;
  photoURL?: string;
};

export default function Index() {
  const [currentUser, setCurrentUser] = useState(getAuth().currentUser);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null); // Add this state
  const [sentRequests, setSentRequests] = useState<string[]>([]);
  const [authLoading, setAuthLoading] = useState(true);

  // Add the recommendations hook
  const { recommendations, loading: recommendationsLoading } =
    useRecommendedFriends();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);

      if (!auth.currentUser) {
        router.replace("/login");
      }
    });
    return unsubscribe;
  }, []);

  // Add this useEffect to fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!currentUser) return;

      try {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data() as UserProfile;
          setUserProfile(userData);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [currentUser]);

  const handleSendFriendRequest = async (targetUid: string) => {
    if (!currentUser) return;

    const success = await sendFriendRequest(currentUser.uid, targetUid);
    if (success) {
      setSentRequests((prev) => [...prev, targetUid]);
    }
  };

  const renderItem = ({ item }: { item: User }) => {
    const isRequestSent = sentRequests.includes(item.id);

    const handleViewProfile = (userId: string) => {
      router.push({
        pathname: "/profile",
        params: {
          userId: userId,
        },
      });
    };

    return (
      <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
        <TouchableOpacity
          onPress={() => handleViewProfile(item.id)}
          activeOpacity={0.8}
        >
          <CustomCard
            imageUrl={
              item.photoURL ||
              "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"
            }
            title={`${item.firstName} ${item.lastName}`}
            description={`${item.course || "Unknown course"} — ${
              item.semester ? `Semester ${item.semester}` : "Semester N/A"
            }`}
            button={
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  handleSendFriendRequest(item.id);
                }}
                disabled={isRequestSent}
                className={`mt-3 px-4 py-2 rounded-[10] ${
                  isRequestSent ? "bg-gray-400" : "bg-primary"
                }`}
              >
                <Text className="text-white text-sm font-medium text-center">
                  {isRequestSent ? "Sent" : "Add Friend"}
                </Text>
              </TouchableOpacity>
            }
            cardWidth={240}
          />
        </TouchableOpacity>
      </View>
    );
  };

  if (authLoading || recommendationsLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg">Loading...</Text>
      </View>
    );
  }

  if (!currentUser) {
    return null;
  }

  const getFirstName = () => {
    if (userProfile) {
      return `${userProfile.firstName}`;
    }
    return currentUser?.displayName || "User";
  };

  return (
    <>
      <ScrollView className="screen flex-1">
        <View className="flex-row items-center justify-between py-2">
          <View className="py-2">
            <Text className="text-xl font-bold">
              👋 Welcome back, {getFirstName()}!
            </Text>
            <Text className="text-sm text-gray-500">
              Let's help you find someone new today.
            </Text>
          </View>

          <View>
            <TouchableOpacity
              onPress={handleLogout}
              className="px-4 py-2 rounded-lg mb-4"
            >
              <Image
                source={{ uri: userProfile?.photoURL || "" }}
                style={{ width: 48, height: 48, borderRadius: 999 }}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View className="flex flex-row justify-between items-center">
          <Text className="text-2xl text-headingtext font-bold align-left">
            Discover People
          </Text>
          <TouchableOpacity onPress={() => router.push("/people")}>
            <Text className="text-sm text-bodytext">See All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={recommendations}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          className="w-full h-full"
          horizontal={true}
        />
        <View className="flex flex-col gap-4 px-4">
          <Card
            onPress={() => router.push("/chat")}
            style={{ backgroundColor: "#FFFFFF" }}
          >
            <Card.Content>
              <Text className="font-semibold">💬 Chat</Text>
            </Card.Content>
          </Card>

          <Card
            onPress={() => router.push("/inbox")}
            style={{ backgroundColor: "#FFFFFF" }}
          >
            <Card.Content>
              <Text className="font-semibold">👥 Friend Requests</Text>
            </Card.Content>
          </Card>

          <Card
            onPress={() => router.push("/profile")}
            style={{ backgroundColor: "#FFFFFF" }}
          >
            <Card.Content>
              <Text className="font-semibold">🧑‍💼 My Profile</Text>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </>
  );
}
