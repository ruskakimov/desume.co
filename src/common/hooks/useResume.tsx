import { User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { firestore } from "../../App";
import { sortExperiences } from "../functions/experiences";
import { Resume } from "../interfaces/resume";

function getResumeDocRef(uid: string) {
  return doc(firestore, "resumes", uid);
}

export default function useResume(
  user: User | null
): [Resume | null, (updatedResume: Resume) => void] {
  const [resume, setResume] = useState<Resume | null>(null);

  useEffect(() => {
    if (user) {
      getDoc(getResumeDocRef(user.uid))
        .then((snapshot) => {
          // TODO: Defensive programming
          const resume = snapshot.data() as Resume | undefined;
          setResume({
            personalDetails: resume?.personalDetails ?? {
              fullName: user.displayName ?? "",
              title: "",
              email: user.email ?? "",
              phoneNumber: user.phoneNumber ?? "",
              websiteUrl: "",
              location: "",
            },
            workHistory: sortExperiences(resume?.workHistory ?? []),
            educationHistory: sortExperiences(resume?.educationHistory ?? []),
            projectHistory: sortExperiences(resume?.projectHistory ?? []),
            skillGroups: resume?.skillGroups ?? [],
          });
        })
        .catch((reason) => {
          console.error(reason);
          toast.error("Failed to load data.");
        });
    }
  }, [user?.uid]);

  const updateResume = (updatedResume: Resume) => {
    setResume(updatedResume);

    if (user) {
      // Warning: Doesn't resolve when offline.
      // Warning: Writes are queued when offline, which can potentially send a lot of redundant writes at once.
      setDoc(getResumeDocRef(user.uid), updatedResume).catch((reason) => {
        console.error(reason);
        toast.error("Failed to save data.");
      });
    }
  };

  return [resume, updateResume];
}
