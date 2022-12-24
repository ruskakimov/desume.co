import { CheckCircleIcon, Bars2Icon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import { useEffect, useState } from "react";
import Checkbox from "../../common/components/Checkbox";
import PageHeader from "../../common/components/PageHeader";
import { Resume, WorkExperience } from "../../common/interfaces/resume";
import WorkHistory from "./WorkHistory";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { firebaseAuth, firestore } from "../../App";
import { toast } from "react-hot-toast";

const navigation = [
  {
    name: "Personal details",
    href: "#",
    icon: CheckCircleIcon,
    current: false,
  },
  { name: "Work history", href: "#", icon: CheckCircleIcon, current: true },
  { name: "Education", href: "#", icon: CheckCircleIcon, current: false },
  { name: "Projects", href: "#", icon: CheckCircleIcon, current: false },
  { name: "Skills", href: "#", icon: CheckCircleIcon, current: false },
];

export default function ContentPage() {
  const [workHistory, setWorkHistory] = useState<WorkExperience[] | null>(null);

  useEffect(() => {
    const uid = firebaseAuth.currentUser!.uid;
    const resumeDoc = doc(firestore, "resumes", uid);

    getDoc(resumeDoc)
      .then((snapshot) => {
        // TODO: Defensive programming
        const resume = snapshot.data() as Resume | undefined;
        setWorkHistory(resume?.workHistory || []);
      })
      .catch((reason) => {
        console.error(reason);
        toast.error("Failed to load data.");
      });
  }, []);

  useEffect(() => {
    if (workHistory !== null) {
      const uid = firebaseAuth.currentUser!.uid;
      const resumeDoc = doc(firestore, "resumes", uid);

      // Warning: Writes are queued when offline, which can potentially send a lot of redundant writes at once.
      setDoc(resumeDoc, { workHistory }).catch((reason) => {
        console.error(reason);
        toast.error("Failed to sync data.");
      });
    }
  }, [workHistory]);

  return (
    <>
      <PageHeader title="Content" />

      <div className="lg:grid lg:grid-cols-[16rem_1fr] lg:gap-x-5">
        <aside className="py-6 px-2 sm:pt-0 sm:pb-6 sm:px-0 lg:py-0 lg:px-0">
          <nav className="space-y-1 lg:fixed lg:w-[16rem]">
            {navigation.map((item, index) => (
              <a
                key={item.name}
                href={item.href}
                className={classNames(
                  item.current
                    ? "bg-white text-gray-900"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50",
                  "group rounded-md px-3 py-2 flex gap-3 items-center text-sm font-medium"
                )}
                aria-current={item.current ? "page" : undefined}
              >
                <Checkbox checked={true} disabled={index === 0} />

                <span className="truncate">{item.name}</span>

                {index !== 0 ? (
                  <Bars2Icon
                    className="text-gray-400 flex-shrink-0 ml-auto mr-1 h-4 w-4"
                    aria-hidden="true"
                  />
                ) : null}
              </a>
            ))}
          </nav>
        </aside>

        <div className="space-y-6">
          <WorkHistory
            experiences={workHistory}
            onChange={(experiences) => setWorkHistory(experiences)}
          />
        </div>
      </div>
    </>
  );
}
