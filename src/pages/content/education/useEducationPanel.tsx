import React, { useRef, useState } from "react";
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import MonthYearField from "../../../common/components/fields/MonthYearField";
import TextField from "../../../common/components/fields/TextField";
import WebsiteField from "../../../common/components/fields/WebsiteField";
import SlideOver from "../../../common/components/SlideOver";
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
    schoolWebsiteUrl: formData.schoolWebsiteUrl ?? null,
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
 * @returns a promise of edited experience or `null` if user cancels.
 */
type OpenEducationPanel = (
  experience: EducationExperience | null
) => Promise<EducationExperience | null>;

/**
 * @returns edited experience or `null` if user cancels.
 */
type ResolveCallback = (experience: EducationExperience | null) => void;

export default function useEducationPanel(
  title: string
): [OpenEducationPanel, React.ReactNode] {
  const [isOpen, setIsOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm<EducationForm>();
  const [bullets, setBullets] = useState<FormBullet[]>([]);
  const resolveCallbackRef = useRef<ResolveCallback | null>(null);

  const openPanel = (
    experience: EducationExperience | null,
    onResolve: ResolveCallback
  ) => {
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
    resolveCallbackRef.current = onResolve;
    setIsOpen(true);
  };

  const closePanel = () => setIsOpen(false);

  const onSubmit: SubmitHandler<EducationForm> = (formData) => {
    const newExperience = convertFormDataToExperience(formData);
    newExperience.bulletPoints = bullets.filter((b) => !b.shouldDelete);
    resolveCallbackRef.current?.(newExperience);
    closePanel();
  };

  const onCancel = () => {
    resolveCallbackRef.current?.(null);
    closePanel();
  };

  const onError: SubmitErrorHandler<EducationForm> = (error) =>
    console.error(error);

  const currentYear = new Date().getFullYear();

  return [
    (experience) =>
      new Promise((resolve) => {
        openPanel(experience, resolve);
      }),
    <SlideOver
      isOpen={isOpen}
      title={title}
      onClose={onCancel}
      onSubmit={handleSubmit(onSubmit, onError)}
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

      <BulletForm bullets={bullets} onChange={setBullets} />
    </SlideOver>,
  ];
}
