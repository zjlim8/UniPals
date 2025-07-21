import { db } from "@/firebaseSetup";
import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { Alert } from "react-native";

export const sendFriendRequest = async (
  currentUserId: string,
  targetUserId: string
): Promise<boolean> => {
  try {
    const requestRef = doc(collection(db, "friend_requests"));
    await setDoc(requestRef, {
      sender: currentUserId,
      recipient: targetUserId,
      status: "pending",
      timestamp: serverTimestamp(),
    });

    Alert.alert("Success", "Friend request sent!");
    return true;
  } catch (error) {
    console.error("Error sending friend request:", error);
    Alert.alert("Error", "Failed to send friend request");
    return false;
  }
};
