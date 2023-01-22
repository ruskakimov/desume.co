import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useContextResume } from "../../../AppShell";
import TextField from "../../../common/components/fields/TextField";
import WebsiteField from "../../../common/components/fields/WebsiteField";
import ShimmerOverlay from "../../../common/components/ShimmerOverlay";
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

interface PersonalDetailsForm {
  fullName?: string;
  title?: string;
  email?: string;
  phoneNumber?: string;
  websiteUrl?: string;
  location?: string;
}

function convertDetailsToFormData(
  details: PersonalDetails
): PersonalDetailsForm {
  return {
    fullName: details.fullName,
    title: details.title,
    email: details.email,
    phoneNumber: details.phoneNumber,
    websiteUrl: details.websiteUrl,
    location: details.location,
  };
}

function convertFormDataToDetails(
  formData: PersonalDetailsForm
): PersonalDetails {
  return {
    fullName: formData.fullName ?? "",
    title: formData.title ?? "",
    email: formData.email ?? "",
    phoneNumber: formData.phoneNumber ?? "",
    websiteUrl: formData.websiteUrl ?? "",
    location: formData.location ?? "",
  };
}

const PersonalDetailsSection: React.FC = () => {
  const [details, setDetails] = usePersonalDetails();
  const { register, reset, getValues } = useForm<PersonalDetailsForm>();

  const isLoading = details === null;

  useEffect(() => {
    if (details) reset(convertDetailsToFormData(details));
  }, [details]);

  return (
    <>
      <div className="h-10 flex justify-between items-center">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Personal details
        </h3>
      </div>

      <form
        onChange={() => {
          const formData = getValues();
          const details = convertFormDataToDetails(formData);
          setDetails(details);
        }}
      >
        <div className="mb-10 grid grid-cols-2 gap-6">
          <div className="col-span-full sm:col-span-1">
            <ShimmerOverlay loading={isLoading}>
              <TextField label="Full name" {...register("fullName")} />
            </ShimmerOverlay>
          </div>

          <div className="col-span-full sm:col-span-1">
            <ShimmerOverlay loading={isLoading}>
              <TextField
                label="Title"
                placeholder="Ex: Software Engineer"
                {...register("title")}
              />
            </ShimmerOverlay>
          </div>

          <div className="col-span-full sm:col-span-1">
            <ShimmerOverlay loading={isLoading}>
              <TextField label="Email" {...register("email")} />
            </ShimmerOverlay>
          </div>

          <div className="col-span-full sm:col-span-1">
            <ShimmerOverlay loading={isLoading}>
              <WebsiteField
                label="Portfolio website"
                {...register("websiteUrl")}
              />
            </ShimmerOverlay>
          </div>

          <div className="col-span-full sm:col-span-1">
            <ShimmerOverlay loading={isLoading}>
              <TextField
                label="Phone number"
                placeholder="Ex: +1 250-555-0199"
                {...register("phoneNumber")}
              />
            </ShimmerOverlay>
          </div>

          <div className="col-span-full sm:col-span-1">
            <ShimmerOverlay loading={isLoading}>
              <TextField
                label="Location"
                placeholder="Ex: Vancouver, Canada"
                {...register("location")}
              />
            </ShimmerOverlay>
          </div>
        </div>
      </form>
    </>
  );
};

export default PersonalDetailsSection;
