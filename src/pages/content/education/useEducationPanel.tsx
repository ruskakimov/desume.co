import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import MonthYearField from "../../../common/components/fields/MonthYearField";
import TextField from "../../../common/components/fields/TextField";
import WebsiteField from "../../../common/components/fields/WebsiteField";
import SlideOver from "../../../common/components/SlideOver";
import useEditFlow from "../../../common/hooks/useEditFlow";
import { EducationExperience } from "../../../common/interfaces/resume";
import BulletForm, { FormBullet } from "../components/BulletForm";

interface EducationForm {
  schoolName: string;
  schoolWebsiteUrl?: string;
  degree: string;
  startDateMonth: string;
  startDateYear: string;
  endDateMonth: string;
  endDateYear: string;
}

function convertFormDataToExperience(
  formData: EducationForm
): EducationExperience {
  return {
    schoolName: formData.schoolName,
    schoolWebsiteUrl: formData.schoolWebsiteUrl ?? "",
    degree: formData.degree,
    startDate: {
      month: parseInt(formData.startDateMonth),
      year: parseInt(formData.startDateYear),
    },
    endDate: {
      month: parseInt(formData.endDateMonth!),
      year: parseInt(formData.endDateYear!),
    },
    bulletPoints: [],
    included: true,
  };
}

function convertExperienceToFormData(
  experience: EducationExperience
): EducationForm {
  return {
    schoolName: experience.schoolName,
    schoolWebsiteUrl: experience.schoolWebsiteUrl ?? undefined,
    degree: experience.degree,
    startDateMonth: experience.startDate.month.toString(),
    startDateYear: experience.startDate.year.toString(),
    endDateMonth: experience.endDate.month.toString(),
    endDateYear: experience.endDate.year.toString(),
  };
}

/**
 * @param experience experience for edit or `null` for a new one.
 * @returns a promise of edited education or `null` if deleted. Promise is rejected if user cancels.
 */
type OpenEducationPanel = (
  experience: EducationExperience | null
) => Promise<EducationExperience | null>;

export default function useEducationPanel(): [
  OpenEducationPanel,
  React.ReactNode
] {
  const {
    register,
    reset,
    getValues,
    trigger,
    formState: { isDirty },
  } = useForm<EducationForm>();
  const [bullets, setBullets] = useState<FormBullet[]>([]);
  const touchedBulletsRef = useRef<boolean>(false);

  const { openEditDialog, buildDialogProps, confirmationPopups } =
    useEditFlow<EducationExperience>();

  const openPanel = (experience: EducationExperience | null) => {
    if (experience) {
      // Edit experience
      const prefilledForm = convertExperienceToFormData(experience);
      reset(prefilledForm);
      setBullets(
        experience.bulletPoints.map((bulletPoint) => ({
          ...bulletPoint,
          shouldDelete: false,
        }))
      );
    } else {
      // Add experience
      reset();
      setBullets([]);
    }
    touchedBulletsRef.current = false;
    return openEditDialog({ isCreateNew: experience === null });
  };

  const currentYear = new Date().getFullYear();

  return [
    openPanel,
    <SlideOver
      {...buildDialogProps({
        titleName: "education",
        getIsDirty: () => isDirty || touchedBulletsRef.current,
        getIsValid: () => trigger(undefined, { shouldFocus: true }),
        getDeleteName: () =>
          `${getValues("degree")} at ${getValues("schoolName")}`,
        getData: () => {
          const formData = getValues();
          const newExperience = convertFormDataToExperience(formData);
          newExperience.bulletPoints = bullets.filter((b) => !b.shouldDelete);
          return newExperience;
        },
      })}
    >
      <div className="grid grid-cols-6 gap-6">
        <div className="col-span-6 sm:col-span-3">
          <TextField
            label="School name"
            {...register("schoolName", { required: true })}
          />
        </div>

        <div className="col-span-6 sm:col-span-3">
          <WebsiteField
            label="School website"
            {...register("schoolWebsiteUrl")}
          />
        </div>

        <div className="col-span-6">
          <TextField
            label="Degree and field of study"
            {...register("degree", { required: true })}
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
            label="End date (or expected)"
            endYear={currentYear + 8}
            monthProps={register("endDateMonth", {
              required: true,
            })}
            yearProps={register("endDateYear", {
              required: true,
            })}
          />
        </div>
      </div>

      <BulletForm
        bullets={bullets}
        onChange={(bullets) => {
          touchedBulletsRef.current = true;
          setBullets(bullets);
        }}
      />

      {confirmationPopups}
    </SlideOver>,
  ];
}
