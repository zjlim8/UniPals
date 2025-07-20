import { db } from "@/firebase";
import { router, useLocalSearchParams } from "expo-router";
import { getAuth } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Chip } from "react-native-paper";
import ProfilePicture from "../profilepicsetup";

type UserProfile = {
  firstName: string;
  lastName: string;
  course: string;
  semester: string;
  interests: string[];
  bio: string;
  photoURL: string;
  privacySettings?: {
    profileVisibility: "public" | "friends" | "private";
    showCourse: boolean;
    showSemester: boolean;
    showBio: boolean;
    showInterests: boolean;
    allowFriendRequests: boolean;
    showOnlineStatus: boolean;
  };
};

const Profile = () => {
  const params = useLocalSearchParams();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [canViewProfile, setCanViewProfile] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const currentUser = getAuth().currentUser;

  const targetUserId = (params.userId as string) || currentUser?.uid;
  const isOwnProfile = targetUserId === currentUser?.uid;

  const handleImageUpload = async (uri: string) => {
    if (!currentUser || !isOwnProfile) return;

    try {
      await setDoc(
        doc(db, "users", currentUser.uid),
        {
          photoURL: uri,
        },
        { merge: true }
      );

      // Update local state
      setProfile((prev) => (prev ? { ...prev, photoURL: uri } : null));
    } catch (error) {
      console.error("Error updating profile picture:", error);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!targetUserId) {
          setLoading(false);
          return;
        }

        const userDoc = await getDoc(doc(db, "users", targetUserId));
        if (userDoc.exists()) {
          const userData = userDoc.data() as UserProfile;
          setProfile(userData);

          // Check if viewing own profile
          if (isOwnProfile) {
            setCanViewProfile(true);
            setLoading(false);
            return;
          }

          // Check friendship status
          if (currentUser) {
            const friendshipQuery = query(
              collection(db, "friends"),
              where("users", "array-contains", currentUser.uid)
            );
            const friendshipSnapshot = await getDocs(friendshipQuery);
            const isFriendResult = friendshipSnapshot.docs.some((doc) =>
              doc.data().users.includes(targetUserId)
            );
            setIsFriend(isFriendResult);

            // Check privacy settings
            const privacySettings = userData.privacySettings || {
              profileVisibility: "public",
              showCourse: true,
              showSemester: true,
              showBio: true,
              showInterests: true,
              allowFriendRequests: true,
              showOnlineStatus: true,
            };

            let canView = false;
            switch (privacySettings.profileVisibility) {
              case "public":
                canView = true;
                break;
              case "friends":
                canView = isFriendResult;
                break;
              case "private":
                canView = false;
                break;
              default:
                canView = true;
            }
            setCanViewProfile(canView);
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [params.userId, currentUser, targetUserId, isOwnProfile]);

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

  if (!canViewProfile && !isOwnProfile) {
    return (
      <View className="flex-1 justify-center items-center bg-background px-6">
        <Text className="text-xl font-semibold text-center mb-4">
          This profile is private
        </Text>
        <Text className="text-center text-gray-600">
          {isFriend
            ? "This user has set their profile to private"
            : "You need to be friends with this user to view their profile"}
        </Text>
      </View>
    );
  }

  const privacySettings = profile.privacySettings || {
    profileVisibility: "public",
    showCourse: true,
    showSemester: true,
    showBio: true,
    showInterests: true,
    allowFriendRequests: true,
    showOnlineStatus: true,
  };

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
          <ProfilePicture
            imageUri={profile.photoURL}
            size={100}
            editable={isOwnProfile}
            userId={currentUser?.uid}
            onImageUpload={handleImageUpload}
          />
        </View>
      </View>

      {/* Profile Info Section */}
      <View className="px-5 pt-16">
        {/* Name and Course Info */}
        <Text className="text-2xl font-bold text-center text-headingtext">
          {profile.firstName} {profile.lastName}
        </Text>

        {(isOwnProfile || privacySettings.showCourse) && (
          <Text className="text-lg text-center text-headingtext mt-1">
            {profile.course}
          </Text>
        )}

        {(isOwnProfile || privacySettings.showSemester) && (
          <Text className="text-lg text-center text-headingtext">
            Semester {profile.semester}
          </Text>
        )}

        {/* Action Buttons */}
        <View className="flex-row justify-center gap-4 my-4">
          {isOwnProfile ? (
            <TouchableOpacity
              onPress={() => router.push("/editprofile")}
              className="bg-primary px-6 py-2 rounded-[15]"
            >
              <Text className="text-white font-semibold p-1">Edit Profile</Text>
            </TouchableOpacity>
          ) : (
            <>
              {privacySettings.allowFriendRequests && !isFriend && (
                <TouchableOpacity className="bg-primary px-6 py-2 rounded-[15]">
                  <Text className="text-white font-semibold p-1">
                    Add Friend
                  </Text>
                </TouchableOpacity>
              )}
              {isFriend && (
                <TouchableOpacity className="bg-primary px-6 py-2 rounded-[15]">
                  <Text className="text-white font-semibold p-1">Message</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>

        {/* Bio */}
        {(isOwnProfile || privacySettings.showBio) && (
          <Text className="text-gray-600 text-center mt-4 text-sm">
            {profile.bio}
          </Text>
        )}

        {/* Interests Section */}
        {(isOwnProfile || privacySettings.showInterests) && (
          <View className="mt-6">
            <Text className="text-xl font-bold text-primary mb-3">
              Interests
            </Text>
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
        )}

        {/* Friends Section */}
        <View className="mt-6">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-xl font-bold text-primary">Friends</Text>
            {isOwnProfile && (
              <TouchableOpacity onPress={() => router.push("/friends")}>
                <Text className="text-primary font-semibold">See all</Text>
              </TouchableOpacity>
            )}
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
