import { db } from "@/firebase";
import { getAuth } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
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

export default function Inbox() {
  const currentUser = getAuth().currentUser;
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  type Notification = {
    id: string;
    name: string;
    avatar: string;
    type: string;
  };

  type FriendRequest = {
    uid: string;
    firstName: string;
    lastName: string;
    course: string;
    semester: string;
    avatar: string;
  };

  useEffect(() => {
    if (!currentUser) {
      Alert.alert("Error", "No user is logged in.");
      return;
    }

    const fetchInbox = async () => {
      // Friend Requests
      const reqSnap = await getDocs(
        collection(db, "friend_requests", currentUser.uid, "from")
      );
      const reqData = [];
      for (const docSnap of reqSnap.docs.slice(0, 5)) {
        const fromUid = docSnap.id;
        const userDoc = await getDoc(doc(db, "users", fromUid));
        const user = userDoc.data();
        if (user) {
          reqData.push({
            uid: fromUid,
            firstName: user.firstName,
            lastName: user.lastName,
            course: user.course || "",
            semester: user.semester || "",
            avatar: user.photoURL || "https://i.pravatar.cc/100?img=1",
          });
        }
      }
      setRequests(reqData);

      // Notifications
      const notifSnap = await getDocs(
        collection(db, "notifications", currentUser.uid)
      );
      const notifData = [];
      for (const notifDoc of notifSnap.docs) {
        const data = notifDoc.data();
        const fromUid = data.from;
        const userDoc = await getDoc(doc(db, "users", fromUid));
        const user = userDoc.data();
        if (user) {
          notifData.push({
            id: notifDoc.id,
            name: user.fullName,
            avatar: user.photoURL || "https://i.pravatar.cc/100?img=5",
            type: data.type,
          });
        }
      }
      setNotifications(notifData);
    };

    fetchInbox();
  }, []);

  const handleAccept = async (uid: string) => {
    if (!currentUser) return;
    try {
      const now = serverTimestamp();
      await setDoc(doc(db, "friends", currentUser.uid, uid), {
        timestamp: now,
      });
      await setDoc(doc(db, "friends", uid, currentUser.uid), {
        timestamp: now,
      });

      await deleteDoc(doc(db, "friend_requests", currentUser.uid, "from", uid));

      await setDoc(doc(db, "notifications", uid, Date.now().toString()), {
        from: currentUser.uid,
        type: "friend_accept",
        timestamp: now,
        seen: false,
      });

      Alert.alert("Friend request accepted!");
      setRequests((prev) => prev.filter((u) => u.uid !== uid));
    } catch (err) {
      Alert.alert("Error", "Could not accept request.");
    }
  };

  const handleDeleteNotification = async (notifId: string) => {
    if (!currentUser) {
      Alert.alert("Error", "No user is logged in.");
      return;
    }
    await deleteDoc(doc(db, "notifications", currentUser.uid, notifId));
    setNotifications((prev) => prev.filter((n) => n.id !== notifId));
  };

  const renderRequest = ({ item }: { item: FriendRequest }) => (
    <View className="flex-row items-center px-4 py-3 border-b border-gray-200">
      <Image
        source={{ uri: item.avatar }}
        className="w-12 h-12 rounded-full mr-3"
      />
      <View className="flex-1">
        <Text className="font-semibold text-base">
          {item.firstName} {item.lastName}
        </Text>
        <Text className="text-gray-500 text-sm">sent you a friend request</Text>
      </View>
      <TouchableOpacity
        onPress={() => handleAccept(item.uid)}
        className="bg-green-500 px-3 py-1 rounded-full"
      >
        <Text className="text-white text-sm font-medium">Accept</Text>
      </TouchableOpacity>
    </View>
  );

  const renderNotification = ({ item }: { item: Notification }) => (
    <View className="flex-row items-center px-4 py-3 border-b border-gray-200">
      <Image
        source={{ uri: item.avatar }}
        className="w-12 h-12 rounded-full mr-3"
      />
      <View className="flex-1">
        <Text className="font-semibold text-base">{item.name}</Text>
        <Text className="text-gray-500 text-sm">
          accepted your friend request
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => handleDeleteNotification(item.id)}
        className="bg-red-500 px-3 py-1 rounded-full"
      >
        <Text className="text-white text-sm text-center">Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView className="flex-1 bg-white pt-12 px-4">
      <Text className="text-2xl font-bold text-blue-600 mb-3">Inbox</Text>

      {/* Friend Requests */}
      <Text className="text-lg font-semibold mb-1">Friend Requests</Text>
      {requests.length === 0 ? (
        <Text className="text-gray-500 mb-4">No pending friend requests</Text>
      ) : (
        <FlatList
          data={requests}
          renderItem={renderRequest}
          keyExtractor={(item) => item.uid}
          scrollEnabled={false}
        />
      )}

      {/* Notifications */}
      <Text className="text-lg font-semibold mt-6 mb-1">Notifications</Text>
      {notifications.length === 0 ? (
        <Text className="text-gray-500">No new notifications</Text>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      )}
    </ScrollView>
  );
}
