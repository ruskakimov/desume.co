import React from "react";
import { useContextResume } from "../../../AppShell";
import TextField from "../../../common/components/fields/TextField";
import WebsiteField from "../../../common/components/fields/WebsiteField";
import { PersonalDetails } from "../../../common/interfaces/resume";

function usePersonalDetails(): [
  PersonalDetails | null,
  (details: PersonalDetails) => void
] {
  const [resume, setResume] = useContextResume();
  return [
    resume?.personalDetails ?? null,
    (details) => setResume({ ...resume!, personalDetails: details }),
  ];
}

const PersonalDetailsSection: React.FC = () => {
  const [details, setDetails] = usePersonalDetails();

  return (
    <>
      <div className="h-10 flex justify-between items-center">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Personal details
        </h3>
      </div>

      <div className="pb-4 grid grid-cols-2 gap-6">
        <div className="col-span-full sm:col-span-1">
          <TextField
            label="Full name"
            // {...register("companyName", { required: true })}
          />
        </div>

        <div className="col-span-full sm:col-span-1">
          <TextField
            label="Title"
            placeholder="Ex: Software Engineer"
            // {...register("companyName", { required: true })}
          />
        </div>

        <div className="col-span-full sm:col-span-1">
          <TextField
            label="Email"
            // {...register("companyName", { required: true })}
          />
        </div>

        <div className="col-span-full sm:col-span-1">
          <WebsiteField
            label="Portfolio website"
            // {...register("companyWebsiteUrl")}
          />
        </div>

        <div className="col-span-full sm:col-span-1">
          <TextField
            label="Phone number"
            placeholder="Ex: +1 250-555-0199"
            // {...register("companyName", { required: true })}
          />
        </div>

        <div className="col-span-full sm:col-span-1">
          <TextField
            label="Location"
            placeholder="Ex: Vancouver, Canada"
            // {...register("companyName", { required: true })}
          />
        </div>
      </div>
    </>
  );
};

export default PersonalDetailsSection;
