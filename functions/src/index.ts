import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

admin.initializeApp();
const db = admin.firestore();

interface User {
  uid: string;
  firstName: string;
  lastName: string;
  course: string;
  semester: number;
  interests: string[];
}

interface RecommendedUser extends User {
  matchScore: number;
  sharedInterests: string[];
}

export const getRecommendedFriends = functions.https.onCall(
  async (data: any, context: any) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "User must be authenticated"
      );
    }

    const currentUserId = context.auth.uid;

    try {
      // Get current user's profile
      const currentUserDoc = await db
        .collection("users")
        .doc(currentUserId)
        .get();

      if (!currentUserDoc.exists) {
        throw new functions.https.HttpsError(
          "not-found",
          "User profile not found"
        );
      }

      const currentUser = {
        uid: currentUserId,
        ...currentUserDoc.data(),
      } as User;

      // Get all other users
      const usersSnapshot = await db.collection("users").get();
      const allUsers: User[] = [];

      usersSnapshot.forEach((doc) => {
        if (doc.id !== currentUserId) {
          allUsers.push({
            uid: doc.id,
            ...doc.data(),
          } as User);
        }
      });

      // Get existing friends to exclude them
      const friendsSnapshot = await db
        .collection("friends")
        .where("users", "array-contains", currentUserId)
        .get();

      const friendIds = new Set<string>();
      friendsSnapshot.forEach((doc) => {
        const users = doc.data().users as string[];
        users.forEach((uid) => {
          if (uid !== currentUserId) {
            friendIds.add(uid);
          }
        });
      });

      // Get pending friend requests to exclude them
      const sentRequestsSnapshot = await db
        .collection("friend_requests")
        .where("sender", "==", currentUserId)
        .where("status", "==", "pending")
        .get();

      const pendingRequestIds = new Set<string>();
      sentRequestsSnapshot.forEach((doc) => {
        pendingRequestIds.add(doc.data().recipient);
      });

      // Calculate recommendations
      const recommendations: RecommendedUser[] = allUsers
        .filter(
          (user) => !friendIds.has(user.uid) && !pendingRequestIds.has(user.uid)
        )
        .map((user) => {
          const matchScore = calculateMatchScore(currentUser, user);
          const sharedInterests = getSharedInterests(
            currentUser.interests || [],
            user.interests || []
          );

          return {
            ...user,
            matchScore,
            sharedInterests,
          };
        })
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 5);

      return recommendations;
    } catch (error) {
      console.error("Error getting recommendations:", error);
      throw new functions.https.HttpsError(
        "internal",
        "Failed to get recommendations"
      );
    }
  }
);

function calculateMatchScore(currentUser: User, targetUser: User): number {
  let score = 0;

  // Shared interests (60%)
  const currentInterests = currentUser.interests || [];
  const targetInterests = targetUser.interests || [];
  const sharedInterests = getSharedInterests(currentInterests, targetInterests);
  const totalUniqueInterests = new Set([
    ...currentInterests,
    ...targetInterests,
  ]).size;

  if (totalUniqueInterests > 0) {
    const jaccardSimilarity = sharedInterests.length / totalUniqueInterests;
    score += jaccardSimilarity * 0.6;
  }

  // Same course (25%)
  if (
    currentUser.course &&
    targetUser.course &&
    currentUser.course === targetUser.course
  ) {
    score += 0.25;
  }

  // Semester proximity (15%)
  if (currentUser.semester && targetUser.semester) {
    const semesterDiff = Math.abs(currentUser.semester - targetUser.semester);
    if (semesterDiff === 0) {
      score += 0.15; // Same semester
    } else if (semesterDiff === 1) {
      score += 0.075; // ±1 semester (half points)
    }
  }

  return Math.round(score * 100); // Return as percentage
}

function getSharedInterests(
  interests1: string[],
  interests2: string[]
): string[] {
  return interests1.filter((interest) => interests2.includes(interest));
}
