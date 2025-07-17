import { images } from "@/constants/images";
import { db } from "@/firebase";
import { Link } from "expo-router";
import { getAuth } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
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
  const currentUser = getAuth().currentUser;
  const [users, setUsers] = useState<User[]>([]);
  const [sentRequests, setSentRequests] = useState<string[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, "users"));
      const list = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((u) => u.id !== currentUser?.uid);
      setUsers(list);
    };

    fetchUsers();
  }, []);

  const sendFriendRequest = async (targetUid: string) => {
    if (!currentUser) return;
    try {
      await setDoc(
        doc(db, "friend_requests", targetUid, "from", currentUser.uid),
        {
          timestamp: serverTimestamp(),
        }
      );
      Alert.alert("Friend request sent!");
    } catch (err) {
      console.error(err);
      Alert.alert("Failed to send request");
    }
  };

  const renderItem = ({ item }: { item: User }) => (
    <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
      <Image
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
        className="bg-indigo-600 px-4 py-1.5 rounded-full"
      >
        <Text className="text-white text-sm font-medium">Add Friend</Text>
      </TouchableOpacity>
    </View>
  );

  return (
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
      />
    </ScrollView>
  );
}
