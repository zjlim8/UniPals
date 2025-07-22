import { functions } from "@/firebaseSetup";
import { useFocusEffect } from "@react-navigation/native";
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

  const fetchRecommendations = useCallback(
    async (isRefreshing = false) => {
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

        const transformedData = (result.data as any[]).map((user) => ({
          ...user,
          id: user.uid,
        }));

        setRecommendations(transformedData);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        Alert.alert("Error", "Failed to fetch friend recommendations");
      } finally {
        setLoading(false);
        if (isRefreshing) setRefreshing(false);
      }
    },
    [currentUser]
  );

  useEffect(() => {
    if (currentUser) {
      fetchRecommendations();
    }
  }, [currentUser, fetchRecommendations]);

  // THIS IS THE MAGIC LINE - refreshes when you return to index
  useFocusEffect(
    useCallback(() => {
      if (currentUser && !loading) {
        fetchRecommendations(true);
      }
    }, [currentUser, loading, fetchRecommendations])
  );

  return {
    recommendations,
    loading,
    refreshing,
    fetchRecommendations,
  };
};

export default useRecommendedFriends;
