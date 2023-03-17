import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import CheckboxField from "../../../common/components/fields/CheckboxField";
import MonthYearField from "../../../common/components/fields/MonthYearField";
import TextField from "../../../common/components/fields/TextField";
import WebsiteField from "../../../common/components/fields/WebsiteField";
import FormModal from "../../../common/components/FormModal";
import { generateId } from "../../../common/functions/ids";
import useEditFlow from "../../../common/hooks/useEditFlow";
import { WorkExperience } from "../../../common/interfaces/resume";

interface WorkExperienceForm {
  companyName: string;
  companyWebsiteUrl?: string;
  jobTitle: string;
  startDateMonth: string;
  startDateYear: string;
  endDateMonth?: string;
  endDateYear?: string;
  isCurrentPosition: boolean;
}

function convertFormDataToExperience(
  formData: WorkExperienceForm,
  oldExperience: WorkExperience | null
): WorkExperience {
  return {
    id: oldExperience?.id ?? generateId(),
    companyName: formData.companyName,
    companyWebsiteUrl: formData.companyWebsiteUrl ?? "",
    jobTitle: formData.jobTitle,
    startDate: {
      month: parseInt(formData.startDateMonth),
      year: parseInt(formData.startDateYear),
    },
    endDate: formData.isCurrentPosition
      ? null
      : {
          month: parseInt(formData.endDateMonth!),
          year: parseInt(formData.endDateYear!),
        },
    bulletPoints: oldExperience?.bulletPoints ?? [],
    included: true,
  };
}

function convertExperienceToFormData(
  experience: WorkExperience
): WorkExperienceForm {
  return {
    companyName: experience.companyName,
    companyWebsiteUrl: experience.companyWebsiteUrl ?? undefined,
    jobTitle: experience.jobTitle,
    startDateMonth: experience.startDate.month.toString(),
    startDateYear: experience.startDate.year.toString(),
    endDateMonth: experience.endDate?.month.toString(),
    endDateYear: experience.endDate?.year.toString(),
    isCurrentPosition: !experience.endDate,
  };
}

/**
 * @param experience experience for edit or `null` for a new one.
 * @returns a promise of edited experience or `null` if deleted. Promise is rejected if user cancels.
 */
type OpenWorkExperiencePanel = (
  experience: WorkExperience | null
) => Promise<WorkExperience | null>;

export default function useWorkExperiencePanel(): [
  OpenWorkExperiencePanel,
  React.ReactNode
] {
  const {
    register,
    reset,
    watch,
    getValues,
    trigger,
    formState: { isDirty },
  } = useForm<WorkExperienceForm>();
  const oldExperienceRef = useRef<WorkExperience | null>(null);

  const { openEditDialog, buildDialogProps, confirmationPopups } =
    useEditFlow<WorkExperience>();

  const openPanel = (experience: WorkExperience | null) => {
    if (experience) {
      // Edit experience
      const prefilledForm = convertExperienceToFormData(experience);
      reset(prefilledForm);
    } else {
      // Add experience
      reset({});
    }
    oldExperienceRef.current = experience;
    return openEditDialog({ isCreateNew: experience === null });
  };

  const currentYear = new Date().getFullYear();

  return [
    openPanel,
    <FormModal
      {...buildDialogProps({
        titleName: "experience",
        getIsDirty: () => isDirty,
        getIsValid: () => trigger(undefined, { shouldFocus: true }),
        getDeleteName: () =>
          `${getValues("jobTitle")} at ${getValues("companyName")}`,
        getData: () => {
          const formData = getValues();
          const newExperience = convertFormDataToExperience(
            formData,
            oldExperienceRef.current
          );
          return newExperience;
        },
      })}
    >
      <div className="grid grid-cols-6 gap-6">
        <div className="col-span-6 sm:col-span-3">
          <TextField
            label="Company name"
            {...register("companyName", { required: true })}
          />
        </div>

        <div className="col-span-6 sm:col-span-3">
          <WebsiteField
            label="Company website"
            {...register("companyWebsiteUrl")}
          />
        </div>

        <div className="col-span-6">
          <TextField
            label="Job title"
            {...register("jobTitle", { required: true })}
          />
        </div>

        <div className="col-span-6 sm:col-span-3">
          <MonthYearField
            label="Start date"
            endYear={currentYear}
            monthProps={register("startDateMonth", {
              required: true,
            })}
            yearProps={register("startDateYear", {
              required: true,
            })}
          />
        </div>

        <div className="col-span-6 sm:col-span-3">
          <MonthYearField
            label="End date"
            endYear={currentYear}
            monthProps={register("endDateMonth", {
              required: !watch("isCurrentPosition"),
              disabled: watch("isCurrentPosition"),
            })}
            yearProps={register("endDateYear", {
              required: !watch("isCurrentPosition"),
              disabled: watch("isCurrentPosition"),
            })}
          />
        </div>

        <div className="col-span-6 -mt-2">
          <CheckboxField
            label="This is my current position"
            {...register("isCurrentPosition")}
          />
        </div>
      </div>

      {confirmationPopups}
    </FormModal>,
  ];
}
