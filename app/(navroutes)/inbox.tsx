import { db } from "@/firebaseSetup";
import { getAuth } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
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
      if (!currentUser) {
        Alert.alert("Error", "No user is logged in.");
        return;
      }
      // Friend Requests
      // Query friend requests where current user is the recipient
      const reqSnap = await getDocs(
        query(
          collection(db, "friend_requests"),
          where("recipient", "==", currentUser.uid),
          where("status", "==", "pending"),
          orderBy("timestamp", "desc"),
          limit(5)
        )
      );

      const reqData = [];
      for (const docSnap of reqSnap.docs) {
        const requestData = docSnap.data();
        const userDoc = await getDoc(doc(db, "users", requestData.sender));
        const user = userDoc.data();

        if (user) {
          reqData.push({
            uid: requestData.sender,
            firstName: user.firstName,
            lastName: user.lastName,
            course: user.course || "",
            semester: user.semester || "",
            avatar:
              user.photoURL ||
              "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg",
          });
        }
      }
      setRequests(reqData);

      // Notifications
      const notifSnap = await getDocs(
        collection(db, "notifications", currentUser.uid, "user_notifications")
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
            name: `${user.firstName} ${user.lastName}`,
            avatar:
              user.photoURL ||
              "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg",
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
      // Find the friend request document
      const requestQuery = query(
        collection(db, "friend_requests"),
        where("sender", "==", uid),
        where("recipient", "==", currentUser.uid),
        where("status", "==", "pending")
      );

      const requestSnap = await getDocs(requestQuery);
      if (requestSnap.empty) {
        Alert.alert("Error", "Friend request not found");
        return;
      }

      const requestDoc = requestSnap.docs[0];

      // Update the request status to accepted
      await setDoc(requestDoc.ref, {
        ...requestDoc.data(),
        status: "accepted",
        acceptedAt: serverTimestamp(),
      });

      // Create friend connections in both directions
      await setDoc(doc(db, "friends", `${currentUser.uid}_${uid}`), {
        users: [currentUser.uid, uid],
        timestamp: serverTimestamp(),
      });

      // Create notification for the sender
      await setDoc(
        doc(collection(db, "notifications", uid, "user_notifications")),
        {
          type: "friend_accept",
          from: currentUser.uid,
          timestamp: serverTimestamp(),
          seen: false,
        }
      );

      // Update local state
      setRequests((prev) => prev.filter((req) => req.uid !== uid));
      Alert.alert("Success", "Friend request accepted!");
    } catch (error) {
      console.error("Error accepting friend request:", error);
      Alert.alert("Error", "Failed to accept friend request");
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
    <ScrollView className="flex-1 bg-white pt-[60] px-4">
      <Text className="text-2xl font-bold text-primary mb-3">Inbox</Text>

      {/* Friend Requests */}
      <Text className="text-lg font-semibold mb-1">Friend Requests</Text>
      {requests.length === 0 ? (
        <Text className="text-bodytext mb-4 mt-1">
          No pending friend requests
        </Text>
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
        <Text className="text-bodytext mt-1">No new notifications</Text>
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
