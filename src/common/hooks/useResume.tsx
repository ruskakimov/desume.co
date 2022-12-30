import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { firestore } from "../../App";
import { Resume } from "../interfaces/resume";

export default function useResume(
  uid: string
): [Resume | null, (updatedResume: Resume) => void] {
  const [resume, setResume] = useState<Resume | null>(null);
  const resumeDocRef = doc(firestore, "resumes", uid);

  useEffect(() => {
    getDoc(resumeDocRef)
      .then((snapshot) => {
        // TODO: Defensive programming
        const resume = snapshot.data() as Resume | undefined;
        setResume({
          personalDetails: null,
          workHistory: resume?.workHistory ?? [],
          educationHistory: resume?.educationHistory ?? [],
          projectHistory: resume?.projectHistory ?? [],
          skills: resume?.skills ?? [],
        });
      })
      .catch((reason) => {
        console.error(reason);
        toast.error("Failed to load data.");
      });
  }, []);

  const updateResume = (updatedResume: Resume) => {
    setResume(updatedResume);

    // Warning: Doesn't resolve when offline.
    // Warning: Writes are queued when offline, which can potentially send a lot of redundant writes at once.
    setDoc(resumeDocRef, updatedResume).catch((reason) => {
      console.error(reason);
      toast.error("Failed to save data.");
    });
  };

  return [resume, updateResume];
}
