import CustomCard from "@/components/CustomCard";
import { db } from "@/firebaseSetup";
import { navigateToChat } from "@/utils/chat";
import { sendFriendRequest } from "@/utils/friendrequest";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { getAuth } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  FlatList,
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
  };
};

type Friend = {
  id: string;
  firstName: string;
  lastName: string;
  course: string;
  semester: number;
  photoURL?: string;
  friendshipDate: any;
};

const Profile = () => {
  const params = useLocalSearchParams();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [canViewProfile, setCanViewProfile] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const [recentFriends, setRecentFriends] = useState<Friend[]>([]);
  const [requestSent, setRequestSent] = useState(false);
  const currentUser = getAuth().currentUser;

  const targetUserId = (params.userId as string) || currentUser?.uid;
  const isOwnProfile = targetUserId === currentUser?.uid;

  const handleSendFriendRequest = async () => {
    if (!currentUser || !targetUserId) return;

    const success = await sendFriendRequest(currentUser.uid, targetUserId);
    if (success) {
      setRequestSent(true);
    }
  };

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

  const fetchRecentFriends = async () => {
    if (!currentUser || !isOwnProfile) return;

    try {
      // Get friends ordered by friendship date (most recent first)
      const friendsQuery = query(
        collection(db, "friends"),
        where("users", "array-contains", currentUser.uid),
        orderBy("timestamp", "desc"),
        limit(5)
      );

      const friendsSnapshot = await getDocs(friendsQuery);

      const friendsData = await Promise.all(
        friendsSnapshot.docs.map(async (docSnapshot) => {
          const friendId = docSnapshot
            .data()
            .users.find((id: string) => id !== currentUser.uid);
          const friendDoc = await getDoc(doc(db, "users", friendId));
          const friendData = friendDoc.data();

          if (!friendData) {
            return null;
          }

          return {
            id: friendId,
            firstName: friendData.firstName,
            lastName: friendData.lastName,
            course: friendData.course || "Unknown course",
            semester: friendData.semester || 0,
            photoURL: friendData.photoURL,
            friendshipDate: docSnapshot.data().timestamp,
          } as Friend;
        })
      );

      // Filter out null values
      const validFriends = friendsData.filter(
        (friend) => friend !== null
      ) as Friend[];
      setRecentFriends(validFriends);
    } catch (error) {
      console.error("Error fetching recent friends:", error);
    }
  };

  const handleViewProfile = (userId: string) => {
    router.push({
      pathname: "/(navroutes)/profile",
      params: {
        userId: userId,
      },
    });
  };

  const renderFriendItem = ({ item }: { item: Friend }) => {
    return (
      <View className="mr-4">
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
            description={`${item.course} — ${
              item.semester ? `Semester ${item.semester}` : "Semester N/A"
            }`}
            button={
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  if (currentUser) {
                    navigateToChat(currentUser.uid, {
                      id: item.id,
                      firstName: item.firstName,
                      lastName: item.lastName,
                      photoURL: item.photoURL,
                    });
                  }
                }}
                className="mt-3 px-4 py-2 rounded-[10] bg-primary"
              >
                <Text className="text-white text-sm font-medium text-center">
                  Message
                </Text>
              </TouchableOpacity>
            }
            cardWidth={240}
          />
        </TouchableOpacity>
      </View>
    );
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
            // Fetch recent friends only for own profile
            await fetchRecentFriends();
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
  };

  return (
    <ScrollView className="flex-1 bg-background">
      {/* Cover Image Section */}
      <View className="w-full h-[250px] relative">
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e",
          }}
          style={{ width: "100%", height: "100%" }}
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
              {!isFriend && (
                <TouchableOpacity
                  onPress={handleSendFriendRequest}
                  disabled={requestSent}
                  className={`px-6 py-2 rounded-[15] ${
                    requestSent ? "bg-gray-400" : "bg-primary"
                  }`}
                >
                  <Text className="text-white font-semibold p-1">
                    {requestSent ? "Sent Request" : "Add Friend"}
                  </Text>
                </TouchableOpacity>
              )}
              {isFriend && (
                <TouchableOpacity
                  onPress={() => {
                    if (currentUser && profile) {
                      navigateToChat(currentUser.uid, {
                        id: targetUserId ?? "",
                        firstName: profile.firstName,
                        lastName: profile.lastName,
                        photoURL: profile.photoURL,
                      });
                    }
                  }}
                  className="bg-primary px-6 py-2 rounded-[15]"
                >
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
            <Text className="text-2xl font-bold text-primary mb-3">
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
        {isOwnProfile && (
          <View className="mt-6">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-2xl font-bold text-primary">Friends</Text>
              <TouchableOpacity onPress={() => router.push("/friends")}>
                <Text className="text-primary font-semibold">See all</Text>
              </TouchableOpacity>
            </View>

            {/* Recent Friends List */}
            {recentFriends.length > 0 ? (
              <FlatList
                data={recentFriends}
                renderItem={renderFriendItem}
                keyExtractor={(item) => item.id}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
              />
            ) : (
              <Text className="text-gray-500 text-center py-4">
                No friends yet. Start connecting with people!
              </Text>
            )}
          </View>
        )}
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
