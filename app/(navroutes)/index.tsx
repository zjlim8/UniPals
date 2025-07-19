import CustomCard from "@/components/CustomCard";
import { images } from "@/constants/images";
import { db } from "@/firebase";
import { Link, router } from "expo-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type User = {
  id: string;
  [key: string]: any;
};

export default function Index() {
  const [currentUser, setCurrentUser] = useState(getAuth().currentUser);
  const [users, setUsers] = useState<User[]>([]);
  const [sentRequests, setSentRequests] = useState<string[]>([]);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);

      if (!user) {
        router.replace("/login");
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!authLoading && currentUser) {
      fetchUsers();
    }
  }, [currentUser, authLoading]);
  const fetchUsers = async () => {
    if (!currentUser) {
      router.replace("/login");
      return;
    }
    try {
      // Get all users
      const snapshot = await getDocs(collection(db, "users"));
      const list = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((u) => u.id !== currentUser?.uid);

      // Get sent friend requests
      const sentRequestsQuery = query(
        collection(db, "friend_requests"),
        where("sender", "==", currentUser.uid),
        where("status", "==", "pending")
      );
      const sentRequestsSnapshot = await getDocs(sentRequestsQuery);
      const sentIds = sentRequestsSnapshot.docs.map(
        (doc) => doc.data().recipient
      );

      // Get existing friends
      const friendsQuery = query(
        collection(db, "friends"),
        where("users", "array-contains", currentUser.uid)
      );
      const friendsSnapshot = await getDocs(friendsQuery);
      const friendIds = friendsSnapshot.docs.map((doc) =>
        doc.data().users.find((id: string) => id !== currentUser.uid)
      );

      // Filter out users with pending requests or already friends
      const filteredList = list.filter(
        (u) => !sentIds.includes(u.id) && !friendIds.includes(u.id)
      );

      setUsers(filteredList);
    } catch (error) {
      console.error("Error fetching users:", error);
      Alert.alert("Error", "Failed to fetch users");
    }
  };

  const sendFriendRequest = async (targetUid: string) => {
    if (!currentUser) return;
    try {
      // Create a new document in the friend_requests collection
      const requestRef = doc(collection(db, "friend_requests"));
      await setDoc(requestRef, {
        sender: currentUser.uid,
        recipient: targetUid,
        status: "pending",
        timestamp: serverTimestamp(),
      });

      // Update local state to show request as sent
      setSentRequests((prev) => [...prev, targetUid]);

      await setDoc(
        doc(collection(db, "notifications", targetUid, "user_notifications")),
        {
          type: "friend_request",
          from: currentUser.uid,
          timestamp: serverTimestamp(),
          seen: false,
        }
      );

      Alert.alert("Friend request sent!");
    } catch (err) {
      console.error(err);
      Alert.alert("Failed to send request");
    }
  };

  const renderItem = ({ item }: { item: User }) => {
    const isRequestSent = sentRequests.includes(item.id);

    return (
      <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
        <CustomCard
          imageUrl={item.photoURL || "https://i.pravatar.cc/100?img=8"}
          title={`${item.firstName} ${item.lastName}`}
          description={`${item.course || "Unknown course"} — ${
            item.semester ? `Semester ${item.semester}` : "Semester N/A"
          }`}
          button={
            <TouchableOpacity
              onPress={() => sendFriendRequest(item.id)}
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
      </View>
    );
  };

  if (authLoading) {
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
          resizeMode="contain"
        />
        <Text>UniPals</Text>
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
          data={users}
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
