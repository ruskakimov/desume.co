import { User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { firestore } from "../../App";
import { extractString } from "../functions/defensive";
import { sortExperiences } from "../functions/experiences";
import { isObject, isString } from "../functions/type-guards";
import { PersonalDetails, Resume, ResumeSectionId } from "../interfaces/resume";

function getResumeDocRef(uid: string) {
  return doc(firestore, "resumes", uid);
}

const defaultSectionOrder: ResumeSectionId[] = [
  "work",
  "education",
  "projects",
  "skills",
];

function parseResume(data: unknown, user: User): Resume {
  // TODO: Complete defensive programming
  const resume: Resume = {
    personalDetails: parseResumePersonalDetails(data, user),
    workHistory: sortExperiences((data as any)?.workHistory ?? []),
    educationHistory: sortExperiences((data as any)?.educationHistory ?? []),
    projectHistory: sortExperiences((data as any)?.projectHistory ?? []),
    skillGroups: (data as any)?.skillGroups ?? [],
    sectionOrder: defaultSectionOrder.map((id) => ({ id, included: true })),
  };

  return resume;
}

function parseResumePersonalDetails(
  data: unknown,
  user: User
): PersonalDetails {
  return {
    fullName: extractString(data, "fullName") ?? user.displayName ?? "",
    title: extractString(data, "title") ?? "",
    email: extractString(data, "email") ?? user.email ?? "",
    phoneNumber: extractString(data, "phoneNumber") ?? "",
    websiteUrl: extractString(data, "websiteUrl") ?? "",
    location: extractString(data, "location") ?? "",
  };
}

export default function useResume(
  user: User | null
): [Resume | null, (updatedResume: Resume) => void] {
  const [resume, setResume] = useState<Resume | null>(null);

  useEffect(() => {
    if (user) {
      getDoc(getResumeDocRef(user.uid))
        .then((snapshot) => {
          const data = snapshot.data() as unknown;
          setResume(parseResume(data, user));
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
