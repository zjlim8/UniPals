import InterestTag from "@/components/InterestTag";
import { db } from "@/firebase";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { RouteProp, useRoute } from "@react-navigation/native";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Club = {
  id: string;
  name: string;
  description: string;
  image: string;
  advisor?: string;
  tag?: string;
  social?: string;
  email?: string;
};

type RouteParams = {
  clubpage: { clubId: string };
};

const clubpage = () => {
  const route = useRoute<RouteProp<RouteParams, "clubpage">>();
  const { clubId } = route.params;
  const [club, setClub] = useState<Club | null>(null);

  useEffect(() => {
    const fetchClub = async () => {
      try {
        const docRef = doc(db, "clubs", clubId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setClub({ id: clubId, ...docSnap.data() } as Club);
        }
      } catch (error) {
        console.error("Failed to fetch club:", error);
      }
    };
    fetchClub();
  }, [clubId]);

  if (!club) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <Text>Loading...</Text>
      </View>
    );
  }

  const clubName = club.name || "";
  const clubDescription = club.description || "";
  const clubAdvisor = club.advisor || "";
  const clubTag = club.tag || "";
  const instagramUrl = club.social || "";
  const email = club.email || "";
  const clubImage = club.image || "https://via.placeholder.com/350x150";

  return (
    <ScrollView className="bg-background">
      <Image
        source={{
          uri: clubImage,
        }}
        style={{ width: "100%", height: 350 }}
        resizeMode="cover"
      />
      <View className="bg-background py-5 flex-1 gap-5 px-[25]">
        <Text className="text-2xl font-bold text-headingtext">{clubName}</Text>
        <Text className="text-bodytext text-base text-justify">
          {clubDescription}
        </Text>
        <View className="flex-1 gap-2">
          <Text className="text-lg text-xl font-bold text-headingtext">
            Advisor
          </Text>
          <Text className="text-bodytext text-base">{clubAdvisor}</Text>
        </View>
        <View className="flex-1 gap-2">
          <Text className="text-lg text-xl font-bold text-headingtext">
            Contact Information
          </Text>
          {/* club.social, {Instagram Icon Button} if email != null, {Email Icon Button} */}
          <View className="flex flex-row gap-5">
            <TouchableOpacity
              onPress={() => Linking.openURL(instagramUrl)}
              accessibilityLabel="Open Instagram"
            >
              <MaterialCommunityIcons
                name="instagram"
                size={35}
                color="#E1306C"
              />
            </TouchableOpacity>
            {email && (
              <TouchableOpacity
                onPress={() => Linking.openURL(`mailto:${email}`)}
                accessibilityLabel="Send Email"
              >
                <MaterialCommunityIcons
                  name="email"
                  size={35}
                  color="#3B82F6"
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View className="flex-1 gap-2">
          <Text className="text-lg text-xl font-bold text-headingtext">
            Tags
          </Text>
          <View className="flex-1 flex-row flex-wrap gap-2">
            <InterestTag label={clubTag} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default clubpage;

const styles = StyleSheet.create({});
