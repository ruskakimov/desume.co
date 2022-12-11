import React, { useState } from "react";
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { MonthYear } from "../../common/classes/MonthYear";
import Checkbox from "../../common/components/Checkbox";
import MonthYearField from "../../common/components/fields/MonthYearField";
import TextField from "../../common/components/fields/TextField";
import WebsiteField from "../../common/components/fields/WebsiteField";
import SlideOver from "../../common/components/SlideOver";
import { WorkExperience } from "../../common/interfaces/resume";

interface WorkExperienceForm {
  companyName: string;
  companyWebsiteUrl?: string;
  jobTitle: string;
  startDateMonth: string;
  startDateYear: string;
  endDateMonth?: string;
  endDateYear?: string;
}

function convertFormDateToDomainObject(
  formData: WorkExperienceForm,
  isCurrentPosition: boolean
): WorkExperience {
  return {
    companyName: formData.companyName,
    companyWebsiteUrl: formData.companyWebsiteUrl,
    jobTitle: formData.jobTitle,
    startDate: new MonthYear(
      parseInt(formData.startDateMonth),
      parseInt(formData.startDateYear)
    ),
    endDate: isCurrentPosition
      ? undefined
      : new MonthYear(
          parseInt(formData.endDateMonth!),
          parseInt(formData.endDateYear!)
        ),
    bulletPoints: [],
    included: true,
  };
}

export default function useAddExperiencePanel(
  onAdd: (experience: WorkExperience) => void
): [() => void, React.ReactNode] {
  const [isOpen, setIsOpen] = useState(false);
  const [isCurrentPosition, setIsCurrentPosition] = useState(false);
  const { register, handleSubmit } = useForm<WorkExperienceForm>();

  const openPanel = () => setIsOpen(true);
  const closePanel = () => setIsOpen(false);

  const onSubmit: SubmitHandler<WorkExperienceForm> = (formData) => {
    const newExperience = convertFormDateToDomainObject(
      formData,
      isCurrentPosition
    );
    onAdd(newExperience);
    closePanel();
  };

  const onError: SubmitErrorHandler<WorkExperienceForm> = (error) =>
    console.error(error);

  const currentYear = new Date().getFullYear();

  return [
    openPanel,
    <SlideOver
      isOpen={isOpen}
      title="Add Experience"
      onClose={closePanel}
      onSubmit={handleSubmit(onSubmit, onError)}
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
            label="Start"
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
            label="End"
            endYear={currentYear}
            monthProps={register("endDateMonth", {
              required: !isCurrentPosition,
              disabled: isCurrentPosition,
            })}
            yearProps={register("endDateYear", {
              required: !isCurrentPosition,
              disabled: isCurrentPosition,
            })}
          />
        </div>

        <div className="col-span-6 flex -mt-2">
          <div className="flex h-5 items-center">
            <Checkbox
              id="current-position"
              checked={isCurrentPosition}
              onChange={(e) => setIsCurrentPosition(e.target.checked)}
            />
          </div>
          <label
            htmlFor="current-position"
            className="text-sm font-medium text-gray-500"
          >
            This is my current position
          </label>
        </div>
      </div>
    </SlideOver>,
  ];
}
