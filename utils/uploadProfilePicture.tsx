import { storage } from "@/firebaseSetup";
import * as ImageManipulator from "expo-image-manipulator";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

export const uploadProfileImage = async (
  uri: string,
  userId: string
): Promise<string> => {
  try {
    // Check if user is authenticated
    if (!userId) {
      throw new Error("User ID is required");
    }

    // Compress and resize the image
    const manipulatedImage = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 400, height: 400 } }],
      {
        compress: 0.8,
        format: ImageManipulator.SaveFormat.JPEG,
      }
    );

    // Convert to blob
    const response = await fetch(manipulatedImage.uri);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }

    const blob = await response.blob();

    // Create storage reference with timestamp to avoid conflicts
    const timestamp = Date.now();
    const imageRef = ref(storage, `profile_images/${userId}_${timestamp}.jpg`);

    // Upload with progress monitoring
    const uploadTask = uploadBytesResumable(imageRef, blob);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          console.error("Upload error:", error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            console.error("Error getting download URL:", error);
            reject(error);
          }
        }
      );
    });
  } catch (error) {
    console.error("Error in uploadProfileImage:", error);
    throw error;
  }
};
