import { icons } from "@/constants/icons";
import { router, Tabs } from "expo-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Image } from "react-native";

const NavIcons = ({ focused, icon, title }: any) => {
  return (
    <Image
      source={icon}
      style={{
        width: 30,
        height: 30,
        tintColor: focused ? "#3B82F6" : "#7C7C7C",
      }}
    />
  );
};

const _Layout = () => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { height: 90, paddingTop: 15 },
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <NavIcons focused={focused} icon={icons.home} />
          ),
        }}
      />
      <Tabs.Screen
        name="clubs"
        options={{
          title: "Clubs",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <NavIcons focused={focused} icon={icons.event} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <NavIcons focused={focused} icon={icons.chat} />
          ),
        }}
      />
      <Tabs.Screen
        name="inbox"
        options={{
          title: "Inbox",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <NavIcons focused={focused} icon={icons.inbox} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <NavIcons focused={focused} icon={icons.profile} />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            // Prevent default behavior
            e.preventDefault();
            // Navigate with the current user's ID
            if (userId) {
              router.push({
                pathname: "/(navroutes)/profile",
                params: { userId },
              });
            }
          },
        }}
      />
    </Tabs>
  );
};

export default _Layout;
