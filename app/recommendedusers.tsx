import { functions } from "@/firebaseSetup";
import { getAuth } from "firebase/auth";
import { httpsCallable } from "firebase/functions";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

interface RecommendedUser {
  id: string;
  uid: string;
  firstName: string;
  lastName: string;
  course: string;
  semester: number;
  interests: string[];
  matchScore: number;
  sharedInterests: string[];
  photoURL?: string;
}

export const useRecommendedFriends = () => {
  const [recommendations, setRecommendations] = useState<RecommendedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const currentUser = getAuth().currentUser;

  const fetchRecommendations = async (isRefreshing = false) => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    try {
      if (!isRefreshing) setLoading(true);

      const getRecommendedFriends = httpsCallable(
        functions,
        "getRecommendedFriends"
      );
      const result = await getRecommendedFriends();

      // Transform data to match your existing User interface
      const transformedData = (result.data as any[]).map((user) => ({
        ...user,
        id: user.uid, // Add id property for compatibility
      }));

      setRecommendations(transformedData);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      Alert.alert("Error", "Failed to fetch friend recommendations");
    } finally {
      setLoading(false);
      if (isRefreshing) setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchRecommendations(true);
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchRecommendations();
    }
  }, [currentUser]);

  return {
    recommendations,
    loading,
    refreshing,
    onRefresh,
    fetchRecommendations,
  };
};

export default useRecommendedFriends;
