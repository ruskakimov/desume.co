import React, { useEffect } from "react";
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { useContextResume } from "../../../AppShell";
import TextField from "../../../common/components/fields/TextField";
import WebsiteField from "../../../common/components/fields/WebsiteField";
import PrimaryButton from "../../../common/components/PrimaryButton";
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
  fullName: string;
  title: string;
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
    email: details.email ?? undefined,
    phoneNumber: details.phoneNumber ?? undefined,
    websiteUrl: details.websiteUrl ?? undefined,
    location: details.location ?? undefined,
  };
}

function convertFormDataToDetails(
  formData: PersonalDetailsForm
): PersonalDetails {
  return {
    fullName: formData.fullName,
    title: formData.title,
    email: formData.email ?? null,
    phoneNumber: formData.phoneNumber ?? null,
    websiteUrl: formData.websiteUrl ?? null,
    location: formData.location ?? null,
  };
}

const PersonalDetailsSection: React.FC = () => {
  const [details, setDetails] = usePersonalDetails();
  const { register, handleSubmit, reset } = useForm<PersonalDetailsForm>();

  useEffect(() => {
    if (details) reset(convertDetailsToFormData(details));
  }, [details]);

  const onSubmit: SubmitHandler<PersonalDetailsForm> = (formData) => {
    const details = convertFormDataToDetails(formData);
    setDetails(details);
  };

  const onError: SubmitErrorHandler<PersonalDetailsForm> = (error) =>
    console.error(error);

  return (
    <>
      <div className="h-10 flex justify-between items-center">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Personal details
        </h3>
      </div>

      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <div className="mb-10 grid grid-cols-2 gap-6">
          <div className="col-span-full sm:col-span-1">
            <TextField
              label="Full name"
              {...register("fullName", { required: true })}
            />
          </div>

          <div className="col-span-full sm:col-span-1">
            <TextField
              label="Title"
              placeholder="Ex: Software Engineer"
              {...register("title", { required: true })}
            />
          </div>

          <div className="col-span-full sm:col-span-1">
            <TextField label="Email" {...register("email")} />
          </div>

          <div className="col-span-full sm:col-span-1">
            <WebsiteField
              label="Portfolio website"
              {...register("websiteUrl")}
            />
          </div>

          <div className="col-span-full sm:col-span-1">
            <TextField
              label="Phone number"
              placeholder="Ex: +1 250-555-0199"
              {...register("phoneNumber")}
            />
          </div>

          <div className="col-span-full sm:col-span-1">
            <TextField
              label="Location"
              placeholder="Ex: Vancouver, Canada"
              {...register("location")}
            />
          </div>
        </div>

        <PrimaryButton type="submit" className="ml-auto block">
          Save details
        </PrimaryButton>
      </form>
    </>
  );
};

export default PersonalDetailsSection;
