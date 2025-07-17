import CustomCard from "@/components/CustomCard";
import { images } from "@/constants/images";
import { db } from "@/firebase";
import { Link, router } from "expo-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
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

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, [currentUser]);

  useEffect(() => {
    console.log("Current User:", currentUser);
    const fetchUsers = async () => {
      if (!currentUser) {
        Alert.alert("Error", "No user is logged in.");
        router.push("/login");
        return;
      }
      console.log("Fetching users...");
      const snapshot = await getDocs(collection(db, "users"));
      const list = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((u) => u.id !== currentUser?.uid);

      console.log("Fetched Users:", list);

      const sentRequestRecord = await getDocs(
        collection(db, "friend_requests", currentUser.uid, "to")
      );
      console.log("sentRequestRecord.docs", sentRequestRecord.docs);
      const sentIds = sentRequestRecord.docs.map((doc) => doc.id);
      console.log("sentids", sentIds);

      const filteredList = list.filter((u) => !sentIds.includes(u.id));
      console.log("Filtered Users:", filteredList);
      setUsers(filteredList);
    };

    fetchUsers();
  }, [currentUser]);

  const sendFriendRequest = async (targetUid: string) => {
    if (!currentUser) return;
    try {
      await setDoc(
        doc(db, "friend_requests", targetUid, "from", currentUser.uid),
        {
          timestamp: serverTimestamp(),
        }
      );

      // Add the target user ID to sentRequests state
      setSentRequests((prev) => [...prev, targetUid]);

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
        {/* <Image
          source={{
            uri: item.photoURL || "https://i.pravatar.cc/100?img=8",
          }}
          className="w-12 h-12 rounded-full mr-3"
        />
        <View className="flex-1">
          <Text className="font-semibold text-base">
            {item.firstName} {item.lastName}
          </Text>
          <Text className="text-gray-600 text-sm">
            {item.course || "Unknown course"} —{" "}
            {item.semester ? `Semester ${item.semester}` : "Semester N/A"}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => sendFriendRequest(item.id)}
          disabled={isRequestSent}
          className={`px-4 py-1.5 rounded-full ${
            isRequestSent ? "bg-gray-400" : "bg-indigo-600"
          }`}
        >
          <Text className="text-white text-sm font-medium">
            {isRequestSent ? "Sent" : "Add Friend"}
          </Text>
        </TouchableOpacity> */}
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
              className={`mt-3 px-4 py-2 rounded-full ${
                isRequestSent ? "bg-gray-400" : "bg-indigo-600"
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
