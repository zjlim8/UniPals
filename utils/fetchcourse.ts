import { db } from "@/firebaseSetup";
import { doc, getDoc } from "firebase/firestore";

// Cache to avoid repeated fetches
const courseCache: { [key: string]: string } = {};

export const getCourseName = async (courseCode: string): Promise<string> => {
  // Return from cache if already fetched
  if (courseCache[courseCode]) {
    return courseCache[courseCode];
  }

  try {
    const courseDoc = await getDoc(doc(db, "courses", courseCode));
    if (courseDoc.exists()) {
      const courseName = courseDoc.data().name || courseCode;
      courseCache[courseCode] = courseName; // Cache the result
      return courseName;
    }
  } catch (error) {
    console.error("Error fetching course name:", error);
  }

  // Return the original code if fetch fails
  return courseCode;
};

export const getCourseNameSync = (courseCode: string): string => {
  return courseCache[courseCode] || courseCode;
};
