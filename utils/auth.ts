import { router } from "expo-router";
import { getAuth, signOut } from "firebase/auth";
import { Alert } from "react-native";

export const handleLogout = async () => {
  Alert.alert("Logout", "Are you sure you want to logout?", [
    {
      text: "Cancel",
      style: "cancel",
    },
    {
      text: "Logout",
      style: "destructive",
      onPress: async () => {
        try {
          const auth = getAuth();
          await signOut(auth);
          Alert.alert("Success", "You have been logged out successfully");
          router.replace("/login");
        } catch (error) {
          console.error("Error signing out:", error);
          Alert.alert("Error", "Failed to logout. Please try again.");
        }
      },
    },
  ]);
};
