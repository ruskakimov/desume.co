import React, { useState } from "react";
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import Checkbox from "../../common/components/Checkbox";
import MonthYearField from "../../common/components/fields/MonthYearField";
import TextField from "../../common/components/fields/TextField";
import WebsiteField from "../../common/components/fields/WebsiteField";
import SlideOver from "../../common/components/SlideOver";
import { WorkExperience } from "../../common/interfaces/resume";

export default function useAddExperiencePanel(
  onAdd: (experience: WorkExperience) => void
): [() => void, React.ReactNode] {
  const [isOpen, setIsOpen] = useState(false);
  const openPanel = () => setIsOpen(true);
  const closePanel = () => setIsOpen(false);

  const [isCurrentPosition, setIsCurrentPosition] = useState(false);

  const { register, handleSubmit } = useForm<WorkExperience>();
  const onSubmit: SubmitHandler<WorkExperience> = (experience) => {
    console.log(experience);
    onAdd({ ...experience, bulletPoints: [], included: true });
    closePanel();
  };
  const onError: SubmitErrorHandler<WorkExperience> = (error) =>
    console.error(error);

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
            monthProps={register("startDate.month", {
              required: true,
              valueAsNumber: true,
            })}
            yearProps={register("startDate.year", {
              required: true,
              valueAsNumber: true,
            })}
          />
        </div>

        <div className="col-span-6 sm:col-span-3">
          <MonthYearField
            label="End"
            monthProps={register("endDate.month", {
              valueAsNumber: true,
              disabled: isCurrentPosition,
            })}
            yearProps={register("endDate.year", {
              valueAsNumber: true,
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
