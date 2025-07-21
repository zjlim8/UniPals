import { db } from "@/firebaseSetup";
import { Image } from "expo-image";
import { router } from "expo-router";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

export type ChatRecipient = {
  id: string;
  firstName: string;
  lastName: string;
  photoURL?: string;
};

export const navigateToChat = async (
  currentUserId: string,
  recipient: ChatRecipient
) => {
  try {
    // Create consistent chat ID by sorting user IDs
    const chatId = [currentUserId, recipient.id].sort().join("_");

    if (recipient.photoURL) {
      Image.prefetch(recipient.photoURL);
    }

    // Check if chat document exists, if not create it
    const chatDocRef = doc(db, "friends", chatId);
    const chatDoc = await getDoc(chatDocRef);

    if (!chatDoc.exists()) {
      // Create the friends document which is used for chat tracking
      await setDoc(chatDocRef, {
        users: [currentUserId, recipient.id],
        timestamp: serverTimestamp(),
      });
    }

    router.push({
      pathname: "/chatscreen",
      params: {
        chatId: chatId,
        recipient: btoa(JSON.stringify(recipient)),
      },
    });
  } catch (error) {
    console.error("Error navigating to chat:", error);
  }
};

export const createChatId = (userId1: string, userId2: string): string => {
  return [userId1, userId2].sort().join("_");
};
