import DefaultButton from "@/components/DefaultButton";
import DefaultDropdown from "@/components/DefaultDropdown";
import DropdownSearch from "@/components/DropdownSearch";
import { auth, db } from "@/firebaseSetup";
import { router } from "expo-router";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const semesters = [
  { label: "Semester 1", value: "1" },
  { label: "Semester 2", value: "2" },
  { label: "Semester 3", value: "3" },
  { label: "Semester 4", value: "4" },
  { label: "Semester 5", value: "5" },
  { label: "Semester 6", value: "6" },
  { label: "Semester 7", value: "7" },
  { label: "Semester 8", value: "8" },
  { label: "Semester 9", value: "9" },
];

const coursesetup = () => {
  const [course, setCourse] = React.useState<string>();
  const [semester, setSemester] = React.useState<string>();
  const [courses, setCourses] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isExistingUser, setIsExistingUser] = React.useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Fetch courses
        const querySnapshot = await getDocs(collection(db, "courses"));
        const courseList = querySnapshot.docs.map((doc) => ({
          label: doc.data().name,
          value: doc.data().code,
        }));
        setCourses(courseList);

        // Load existing user data
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.course || userData.semester) {
            setCourse(userData.course || undefined);
            setSemester(userData.semester || undefined);
            setIsExistingUser(true);
          }
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCourseSetup = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Error", "No user is logged in.");
      return;
    }

    try {
      if (!course || !semester) {
        Alert.alert("Error", "Please select a course and semester.");
        return;
      }
      // Set up the course for the user
      await setDoc(
        doc(db, "users", user.uid),
        {
          course: course,
          semester: semester,
        },
        { merge: true } // Merge to update existing fields without overwriting the entire document
      );
      Alert.alert("Success", "Course setup completed!");
      if (isExistingUser) {
        router.back(); // Go back to edit profile
      } else {
        router.replace("/interestsetup"); // Continue setup for new users
      }
    } catch (error) {
      Alert.alert("Error", "Could not set up course.");
      return;
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View className="screen justify-between">
        <View className="gap-2">
          <Text className="headtext mt-[120]">
            {isExistingUser ? "Update your course" : "Which course are you in?"}
          </Text>
          <Text className="text-sm text-bodytext">
            {isExistingUser
              ? "Update your course information!"
              : "Let us know your course and semester to connect you with the right people!"}
          </Text>
          <View className="mt-[20] gap-3">
            <DropdownSearch
              placeholder="Select Course"
              search
              searchPlaceholder="Search course..."
              onChange={(item) => setCourse(item.value)}
              data={courses}
              value={course}
              labelField="label"
              valueField="value"
            />
            <DefaultDropdown
              placeholder="Select Semester"
              data={semesters}
              labelField="label"
              valueField="value"
              value={semester}
              onChange={(item) => setSemester(item.value)}
            />
          </View>
        </View>
        <DefaultButton mode="contained" onPress={handleCourseSetup}>
          {isExistingUser ? "Update" : "Next"}
        </DefaultButton>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default coursesetup;
