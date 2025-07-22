"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecommendedFriends = void 0;
const admin = __importStar(require("firebase-admin"));
const functions = __importStar(require("firebase-functions"));
admin.initializeApp();
const db = admin.firestore();
exports.getRecommendedFriends = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "User must be authenticated");
    }
    const currentUserId = context.auth.uid;
    try {
        // Get current user's profile
        const currentUserDoc = await db
            .collection("users")
            .doc(currentUserId)
            .get();
        if (!currentUserDoc.exists) {
            throw new functions.https.HttpsError("not-found", "User profile not found");
        }
        const currentUser = {
            uid: currentUserId,
            ...currentUserDoc.data(),
        };
        // Get all other users
        const usersSnapshot = await db.collection("users").get();
        const allUsers = [];
        usersSnapshot.forEach((doc) => {
            if (doc.id !== currentUserId) {
                allUsers.push({
                    uid: doc.id,
                    ...doc.data(),
                });
            }
        });
        // Get existing friends to exclude them
        const friendsSnapshot = await db
            .collection("friends")
            .where("users", "array-contains", currentUserId)
            .get();
        const friendIds = new Set();
        friendsSnapshot.forEach((doc) => {
            const users = doc.data().users;
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
        const pendingRequestIds = new Set();
        sentRequestsSnapshot.forEach((doc) => {
            pendingRequestIds.add(doc.data().recipient);
        });
        // Calculate recommendations
        const recommendations = allUsers
            .filter((user) => !friendIds.has(user.uid) && !pendingRequestIds.has(user.uid))
            .map((user) => {
            const matchScore = calculateMatchScore(currentUser, user);
            const sharedInterests = getSharedInterests(currentUser.interests || [], user.interests || []);
            return {
                ...user,
                matchScore,
                sharedInterests,
            };
        })
            .sort((a, b) => b.matchScore - a.matchScore);
        return recommendations;
    }
    catch (error) {
        console.error("Error getting recommendations:", error);
        throw new functions.https.HttpsError("internal", "Failed to get recommendations");
    }
});
function calculateMatchScore(currentUser, targetUser) {
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
    if (currentUser.course &&
        targetUser.course &&
        currentUser.course === targetUser.course) {
        score += 0.25;
    }
    // Semester proximity (15%)
    if (currentUser.semester && targetUser.semester) {
        const semesterDiff = Math.abs(currentUser.semester - targetUser.semester);
        if (semesterDiff === 0) {
            score += 0.15; // Same semester
        }
        else if (semesterDiff === 1) {
            score += 0.075; // ±1 semester (half points)
        }
    }
    return Math.round(score * 100); // Return as percentage
}
function getSharedInterests(interests1, interests2) {
    return interests1.filter((interest) => interests2.includes(interest));
}
//# sourceMappingURL=index.js.map