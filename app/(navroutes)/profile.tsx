import { db } from "@/firebase";
import { router, useLocalSearchParams } from "expo-router";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Avatar, Chip } from "react-native-paper";

type UserProfile = {
  firstName: string;
  lastName: string;
  course: string;
  semester: string;
  interests: string[];
  bio: string;
  avatarUrl: string;
};

const Profile = () => {
  const params = useLocalSearchParams();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const currentUser = getAuth().currentUser;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // If no userId in params, use currentUser.uid
        const targetUserId = (params.userId as string) || currentUser?.uid;

        if (!targetUserId) {
          setLoading(false);
          return;
        }

        const userDoc = await getDoc(doc(db, "users", targetUserId));
        if (userDoc.exists()) {
          setProfile(userDoc.data() as UserProfile);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [params.userId, currentUser]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <Text>Profile not found</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background">
      {/* Cover Image Section */}
      <View className="w-full h-[250px] relative">
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e",
          }}
          className="w-full h-full"
        />
        <View className="absolute -bottom-12 left-1/2 -translate-x-[50px]">
          <Avatar.Image
            size={100}
            source={{ uri: "https://i.pravatar.cc/300" }}
          />
        </View>
      </View>

      {/* Profile Info Section */}
      <View className="px-5 pt-16">
        {/* Name and Course Info */}
        <Text className="text-2xl font-bold text-center text-headingtext">
          {profile.firstName} {profile.lastName}
        </Text>
        <Text className="text-lg text-center text-headingtext mt-1">
          {profile.course}
        </Text>
        <Text className="text-lg text-center text-headingtext">
          Semester {profile.semester}
        </Text>

        {/* Action Buttons */}
        <View className="flex-row justify-center gap-4 my-4">
          <TouchableOpacity className="bg-primary px-6 py-2 rounded-[15]">
            <Text className="text-white font-semibold p-1">Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-primary px-6 py-2 rounded-[15]">
            <Text className="text-white font-semibold p-1">Message</Text>
          </TouchableOpacity>
        </View>

        {/* Bio */}
        <Text className="text-gray-600 text-center mt-4 text-sm">
          {profile.bio}
        </Text>

        {/* Interests Section */}
        <View className="mt-6">
          <Text className="text-xl font-bold text-primary mb-3">Interests</Text>
          <View className="flex-row flex-wrap gap-2">
            {profile.interests?.map((interest: string, index: number) => (
              <Chip
                key={index}
                style={styles.chip}
                textStyle={{ color: "#323232" }}
              >
                {interest}
              </Chip>
            ))}
          </View>
        </View>

        {/* Clubs Section */}
        <View className="mt-6">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-xl font-bold text-primary">Friends</Text>
            <TouchableOpacity onPress={() => router.push("/friends")}>
              <Text className="text-primary font-semibold">See all</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row flex-wrap gap-2">
            {["Tech Club", "Business Club", "Sports Club"].map(
              (club, index) => (
                <Chip
                  key={index}
                  style={styles.chip}
                  textStyle={{ color: "#323232" }}
                >
                  {club}
                </Chip>
              )
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    margin: 4,
    borderColor: "#323232",
    borderWidth: 1,
    backgroundColor: "#fff",
  },
});

export default Profile;
