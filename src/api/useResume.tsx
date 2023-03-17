import { User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { firestore } from "./firebase-setup";
import { extractProperty, extractString } from "../common/functions/defensive";
import { sortExperiences } from "../common/functions/experiences";
import {
  BulletPoint,
  PersonalDetails,
  Resume,
  ResumeSectionId,
} from "../common/interfaces/resume";
import {
  isBoolean,
  isString,
  notNullish,
} from "../common/functions/type-guards";
import { generateId } from "../common/functions/ids";

function getResumeDocRef(uid: string) {
  return doc(firestore, "resumes", uid);
}

const defaultSectionOrder: ResumeSectionId[] = [
  "skills",
  "work",
  "education",
  "projects",
];

function parseResume(data: unknown, user: User): Resume {
  // TODO: Complete defensive programming
  const resume: Resume = {
    personalDetails: parseResumePersonalDetails(data, user),
    workHistory: sortExperiences((data as any)?.workHistory ?? []),
    educationHistory: sortExperiences((data as any)?.educationHistory ?? []),
    projectHistory: sortExperiences((data as any)?.projectHistory ?? []),
    skillGroups: (data as any)?.skillGroups ?? [],
    sectionOrder:
      (data as any)?.sectionOrder ??
      defaultSectionOrder.map((id) => ({ id, included: true })),
  };

  return resume;
}

function parseResumePersonalDetails(
  data: unknown,
  user: User
): PersonalDetails {
  const details = extractProperty(data, "personalDetails");
  return {
    fullName: extractString(details, "fullName") ?? user.displayName ?? "",
    title: extractString(details, "title") ?? "",
    email: extractString(details, "email") ?? user.email ?? "",
    phoneNumber: extractString(details, "phoneNumber") ?? "",
    websiteUrl: extractString(details, "websiteUrl") ?? "",
    location: extractString(details, "location") ?? "",
  };
}

function parseBullets(data: unknown): BulletPoint[] {
  if (!Array.isArray(data)) return [];

  const array = data as unknown[];
  const usedIds = new Set<string>();

  return array
    .map((x) => {
      const id = extractProperty(x, "id");
      const included = extractProperty(x, "included");
      const text = extractProperty(x, "text");

      if (!isString(text)) return null;

      const bullet: BulletPoint = {
        id: isString(id) && !usedIds.has(id) ? id : generateId(),
        included: isBoolean(included) ? included : true,
        text,
      };

      usedIds.add(bullet.id);

      return bullet;
    })
    .filter(notNullish);
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
