import DefaultButton from "@/components/DefaultButton";
import DefaultDropdown from "@/components/DefaultDropdown";
import DropdownSearch from "@/components/DropdownSearch";
import { auth, db } from "@/firebase";
import { router } from "expo-router";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import React, { useEffect } from "react";
import {
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

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "courses"));
        const courseList = querySnapshot.docs.map((doc) => ({
          label: doc.data().name,
          value: doc.data().code,
        }));
        setCourses(courseList);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
    };

    fetchCourses();
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
      router.replace("/clubsetup"); // Redirect to club setup page
    } catch (error) {
      Alert.alert("Error", "Could not set up course.");
      return;
    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View className="screen justify-between">
        <View className="gap-2">
          <Text className="headtext mt-[120]">Which course are you in?</Text>
          <Text className="text-sm text-bodytext">
            Let us know your course and semester to connect you with the right
            people!
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
        <DefaultButton
          mode="contained"
          onPress={handleCourseSetup} // function to handle press button
        >
          Next
        </DefaultButton>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default coursesetup;
