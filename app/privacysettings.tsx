import DefaultButton from "@/components/DefaultButton";
import { db } from "@/firebase";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { getAuth } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { List, Switch } from "react-native-paper";

type PrivacySettings = {
  profileVisibility: "public" | "friends" | "private";
  showCourse: boolean;
  showSemester: boolean;
  showBio: boolean;
  showInterests: boolean;
  allowFriendRequests: boolean;
  showOnlineStatus: boolean;
};

const PrivacySettings = () => {
  const [settings, setSettings] = useState<PrivacySettings>({
    profileVisibility: "public",
    showCourse: true,
    showSemester: true,
    showBio: true,
    showInterests: true,
    allowFriendRequests: true,
    showOnlineStatus: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const currentUser = getAuth().currentUser;

  useEffect(() => {
    loadPrivacySettings();
  }, []);

  const loadPrivacySettings = async () => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    try {
      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.privacySettings) {
          setSettings(userData.privacySettings);
        }
      }
    } catch (error) {
      console.error("Error loading privacy settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const savePrivacySettings = async () => {
    if (!currentUser) {
      Alert.alert("Error", "No user logged in");
      return;
    }

    setSaving(true);
    try {
      await setDoc(
        doc(db, "users", currentUser.uid),
        {
          privacySettings: settings,
        },
        { merge: true }
      );
      Alert.alert("Success", "Privacy settings updated!");
      router.back();
    } catch (error) {
      console.error("Error saving privacy settings:", error);
      Alert.alert("Error", "Failed to save privacy settings");
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: keyof PrivacySettings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background pt-[60]">
      <ScrollView className="flex-1 mx-4 px-4">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Ionicons name="chevron-back" size={24} color="#323232" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-primary">
            Privacy Settings
          </Text>
        </View>

        {/* Profile Visibility */}
        <View className="mb-6">
          <Text className="text-xl font-semibold mb-1">Profile Visibility</Text>
          <List.Section>
            <List.Item
              title="Public"
              description="Anyone can view your profile"
              titleStyle={{ fontWeight: "600", color: "#323232" }}
              descriptionStyle={{ color: "#5C5C5C" }}
              left={() => <List.Icon icon="earth" color="#90A4AE" />}
              right={() => (
                <Switch
                  value={settings.profileVisibility === "public"}
                  onValueChange={() =>
                    updateSetting("profileVisibility", "public")
                  }
                  color="#3B82F6" // Change this to your desired color
                />
              )}
            />
            <List.Item
              title="Friends Only"
              description="Only your friends can view your profile"
              titleStyle={{ fontWeight: "600", color: "#323232" }}
              descriptionStyle={{ color: "#5C5C5C" }}
              left={() => <List.Icon icon="account-group" color="#90A4AE" />}
              right={() => (
                <Switch
                  value={settings.profileVisibility === "friends"}
                  onValueChange={() =>
                    updateSetting("profileVisibility", "friends")
                  }
                  color="#3B82F6"
                />
              )}
            />
            <List.Item
              title="Private"
              description="Only you can view your profile"
              titleStyle={{ fontWeight: "600", color: "#323232" }}
              descriptionStyle={{ color: "#5C5C5C" }}
              left={() => <List.Icon icon="lock" color="#90A4AE" />}
              right={() => (
                <Switch
                  value={settings.profileVisibility === "private"}
                  onValueChange={() =>
                    updateSetting("profileVisibility", "private")
                  }
                  color="#3B82F6"
                />
              )}
            />
          </List.Section>
        </View>

        {/* Profile Information */}
        <View className="mb-6">
          <Text className="text-xl font-semibold mb-1">
            Show Profile Information
          </Text>
          <List.Section>
            <List.Item
              title="Course"
              description="Show your course to others"
              titleStyle={{ fontWeight: "600", color: "#323232" }}
              descriptionStyle={{ color: "#5C5C5C" }}
              left={() => <List.Icon icon="school" color="#90A4AE" />}
              right={() => (
                <Switch
                  value={settings.showCourse}
                  onValueChange={(value) => updateSetting("showCourse", value)}
                  color="#3B82F6"
                />
              )}
            />
            <List.Item
              title="Semester"
              description="Show your semester to others"
              titleStyle={{ fontWeight: "600", color: "#323232" }}
              descriptionStyle={{ color: "#5C5C5C" }}
              left={() => <List.Icon icon="calendar" color="#90A4AE" />}
              right={() => (
                <Switch
                  value={settings.showSemester}
                  onValueChange={(value) =>
                    updateSetting("showSemester", value)
                  }
                  color="#3B82F6"
                />
              )}
            />
            <List.Item
              title="Bio"
              description="Show your bio to others"
              titleStyle={{ fontWeight: "600", color: "#323232" }}
              descriptionStyle={{ color: "#5C5C5C" }}
              left={() => <List.Icon icon="text" color="#90A4AE" />}
              right={() => (
                <Switch
                  value={settings.showBio}
                  onValueChange={(value) => updateSetting("showBio", value)}
                  color="#3B82F6"
                />
              )}
            />
            <List.Item
              title="Interests"
              description="Show your interests to others"
              titleStyle={{ fontWeight: "600", color: "#323232" }}
              descriptionStyle={{ color: "#5C5C5C" }}
              left={() => <List.Icon icon="star" color="#90A4AE" />}
              right={() => (
                <Switch
                  value={settings.showInterests}
                  onValueChange={(value) =>
                    updateSetting("showInterests", value)
                  }
                  color="#3B82F6"
                />
              )}
            />
          </List.Section>
        </View>
      </ScrollView>

      <View className="p-4 mb-5 mx-4">
        <DefaultButton
          mode="contained"
          onPress={savePrivacySettings}
          loading={saving}
        >
          Save Settings
        </DefaultButton>
      </View>
    </View>
  );
};

export default PrivacySettings;
