import { MinusCircleIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import React, { useState } from "react";
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import Checkbox from "../../common/components/Checkbox";
import CheckboxField from "../../common/components/fields/CheckboxField";
import MonthYearField from "../../common/components/fields/MonthYearField";
import TextField from "../../common/components/fields/TextField";
import WebsiteField from "../../common/components/fields/WebsiteField";
import SecondaryButton from "../../common/components/SecondaryButton";
import SlideOver from "../../common/components/SlideOver";
import { BulletPoint, WorkExperience } from "../../common/interfaces/resume";

interface WorkExperienceForm {
  companyName: string;
  companyWebsiteUrl?: string;
  jobTitle: string;
  startDateMonth: string;
  startDateYear: string;
  endDateMonth?: string;
  endDateYear?: string;
}

function convertFormDataToExperience(
  formData: WorkExperienceForm,
  isCurrentPosition: boolean
): WorkExperience {
  return {
    companyName: formData.companyName,
    companyWebsiteUrl: formData.companyWebsiteUrl,
    jobTitle: formData.jobTitle,
    startDate: {
      month: parseInt(formData.startDateMonth),
      year: parseInt(formData.startDateYear),
    },
    endDate: isCurrentPosition
      ? undefined
      : {
          month: parseInt(formData.endDateMonth!),
          year: parseInt(formData.endDateYear!),
        },
    bulletPoints: [],
    included: true,
  };
}

function convertExperienceToFormData(
  experience: WorkExperience
): WorkExperienceForm {
  return {
    companyName: experience.companyName,
    companyWebsiteUrl: experience.companyWebsiteUrl,
    jobTitle: experience.jobTitle,
    startDateMonth: experience.startDate.month.toString(),
    startDateYear: experience.startDate.year.toString(),
    endDateMonth: experience.endDate?.month.toString(),
    endDateYear: experience.endDate?.year.toString(),
  };
}

interface FormBullet extends BulletPoint {
  shouldDelete: boolean;
}

export default function useWorkExperiencePanel(
  title: string,
  onSubmitted: (experience: WorkExperience) => void
): [(experience?: WorkExperience) => void, React.ReactNode] {
  const [isOpen, setIsOpen] = useState(false);
  const [isCurrentPosition, setIsCurrentPosition] = useState(false);
  const { register, handleSubmit, reset } = useForm<WorkExperienceForm>();
  const [bullets, setBullets] = useState<FormBullet[]>([]);

  const openPanel = (experience?: WorkExperience) => {
    if (experience) {
      // Edit experience
      const prefilledForm = convertExperienceToFormData(experience);
      reset(prefilledForm);
      setIsCurrentPosition(experience.endDate === undefined);
      setBullets(
        experience.bulletPoints.map((bulletPoint) => ({
          ...bulletPoint,
          shouldDelete: false,
        }))
      );
    } else {
      // Add experience
      reset();
      setIsCurrentPosition(false);
      setBullets([]);
    }
    setIsOpen(true);
  };
  const closePanel = () => setIsOpen(false);

  const onSubmit: SubmitHandler<WorkExperienceForm> = (formData) => {
    const newExperience = convertFormDataToExperience(
      formData,
      isCurrentPosition
    );
    // TODO: Solve the problem of receiving new bullet IDs
    newExperience.bulletPoints = bullets.filter((b) => !b.shouldDelete);
    onSubmitted(newExperience);
    closePanel();
  };

  const onError: SubmitErrorHandler<WorkExperienceForm> = (error) =>
    console.error(error);

  const currentYear = new Date().getFullYear();

  return [
    openPanel,
    <SlideOver
      isOpen={isOpen}
      title={title}
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
          {/* // TODO: Refactor with a CheckboxField */}
          <div className="mr-3 flex h-5 items-center">
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

      <div className="mt-12">
        <h3 className="mb-4 text-base font-medium text-gray-700">
          Bullet points
        </h3>

        <div className="flex flex-col gap-4">
          {bullets.map((bullet, index) => (
            <div className="flex items-center gap-2">
              <textarea
                className={classNames(
                  "block w-full resize-none rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm",
                  {
                    "cursor-not-allowed border-red-200 bg-red-50 text-red-400":
                      bullet.shouldDelete,
                  }
                )}
                rows={2}
                disabled={bullet.shouldDelete}
                value={bullet.text}
                onChange={(e) => {
                  const newBullets = bullets.slice();
                  newBullets[index] = { ...bullet, text: e.target.value };
                  setBullets(newBullets);
                }}
                autoFocus
              />

              <button
                type="button"
                className={classNames(
                  "flex-shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 no-mouse-focus-ring",
                  {
                    "text-gray-400 hover:text-gray-700": !bullet.shouldDelete,
                    "text-red-400 hover:text-red-700": bullet.shouldDelete,
                  }
                )}
                onClick={() => {
                  const newBullets = bullets.slice();
                  newBullets[index] = {
                    ...bullet,
                    shouldDelete: !bullet.shouldDelete,
                  };
                  setBullets(newBullets);
                }}
              >
                <MinusCircleIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          ))}

          <div>
            <SecondaryButton
              onClick={() => {
                setBullets([
                  ...bullets,
                  { id: "", text: "", included: true, shouldDelete: false },
                ]);
              }}
            >
              Add bullet point
            </SecondaryButton>
          </div>
        </div>
      </div>
    </SlideOver>,
  ];
}
