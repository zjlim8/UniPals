import { uploadProfileImage } from "@/utils/uploadProfilePicture";
import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { ActivityIndicator, Alert, TouchableOpacity, View } from "react-native";

interface ProfilePictureProps {
  imageUri?: string;
  size?: number;
  editable?: boolean;
  userId?: string;
  onImageUpload?: (uri: string) => void;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({
  imageUri,
  size = 100,
  editable = false,
  userId,
  onImageUpload,
}) => {
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    if (!editable || !userId) {
      console.error(
        "Cannot pick image - editable:",
        editable,
        "userId:",
        userId
      );
      return;
    }

    try {
      // Request permission
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "We need camera roll permissions to upload your profile picture."
        );
        return;
      }

      // Show action sheet
      Alert.alert(
        "Select Profile Picture",
        "Choose how you want to select your profile picture",
        [
          {
            text: "Camera",
            onPress: openCamera,
          },
          {
            text: "Photo Library",
            onPress: openImagePicker,
          },
          {
            text: "Cancel",
            style: "cancel",
          },
        ]
      );
    } catch (error) {
      console.error("Error in pickImage:", error);
      Alert.alert("Error", "Failed to open image picker");
    }
  };

  const openCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "We need camera permissions.");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await handleImageUpload(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error opening camera:", error);
      Alert.alert("Error", "Failed to open camera");
    }
  };

  const openImagePicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await handleImageUpload(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error opening image picker:", error);
      Alert.alert("Error", "Failed to open image library");
    }
  };

  const handleImageUpload = async (uri: string) => {
    if (!userId) {
      Alert.alert("Error", "User not authenticated");
      return;
    }

    setUploading(true);
    try {
      const downloadURL = await uploadProfileImage(uri, userId);

      onImageUpload?.(downloadURL);
      Alert.alert("Success", "Profile picture updated!");
    } catch (error) {
      console.error("Error uploading image:", error);

      // More specific error messages
      let errorMessage = "Failed to upload image. Please try again.";
      if (error instanceof Error) {
        if (error.message.includes("storage/unauthorized")) {
          errorMessage =
            "You don't have permission to upload images. Please log in again.";
        } else if (error.message.includes("storage/unknown")) {
          errorMessage =
            "Storage service is currently unavailable. Please try again later.";
        } else if (error.message.includes("network")) {
          errorMessage =
            "Network error. Please check your internet connection.";
        }
      }

      Alert.alert("Upload Failed", errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <TouchableOpacity
      onPress={pickImage}
      disabled={!editable || uploading}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        position: "relative",
      }}
    >
      <Image
        source={{
          uri:
            imageUri ||
            "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg",
        }}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 3,
          borderColor: "#3B82F6",
        }}
      />

      {editable && (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            backgroundColor: "#3B82F6",
            borderRadius: 15,
            width: 30,
            height: 30,
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 2,
            borderColor: "white",
          }}
        >
          {uploading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <MaterialIcons name="camera-alt" size={16} color="white" />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default ProfilePicture;
