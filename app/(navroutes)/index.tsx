import CustomCard from "@/components/CustomCard";
import { images } from "@/constants/images";
import { handleLogout } from "@/utils/auth";
import { sendFriendRequest } from "@/utils/friendrequest";
import { Image } from "expo-image";
import { Link, router } from "expo-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRecommendedFriends } from "../recommendedusers";

type User = {
  id: string;
  [key: string]: any;
};

export default function Index() {
  const [currentUser, setCurrentUser] = useState(getAuth().currentUser);
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

  return (
    <>
      <ScrollView className="screen flex-1">
        <Image
          source={images.logoinvis}
          style={{ width: 100, height: 95 }}
          className="mt-[35] mb-[100]"
          contentFit="contain"
        />
        <Text>UniPals</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text>Logout</Text>
        </TouchableOpacity>
        <Link href="/signup">Signup</Link>
        <Link href="/login">Login</Link>
        <Link href="/verification">Verify</Link>
        <Link href="/loginpass">LoginPass</Link>
        <Link href="/welcome">Welcome</Link>
        <Link href="/accountsetup">Account Setup</Link>
        <Link href="/interestsetup">Interest Setup</Link>
        <Link href="/coursesetup">Course Setup</Link>
        <Link href="/clubpage">Club Page</Link>
        <Link href="/chatscreen">Chat Screen</Link>
        <Link href="/biosetup">Bio</Link>
        <Text className="text-2xl text-headingtext font-bold align-left">
          Discover People
        </Text>
        <FlatList
          data={recommendations}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          className="w-full h-full"
          horizontal={true}
        />
      </ScrollView>
    </>
  );
}
