import { MinusCircleIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import React, { useRef, useState } from "react";
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import CheckboxField from "../../../common/components/fields/CheckboxField";
import MonthYearField from "../../../common/components/fields/MonthYearField";
import TextField from "../../../common/components/fields/TextField";
import WebsiteField from "../../../common/components/fields/WebsiteField";
import SecondaryButton from "../../../common/components/SecondaryButton";
import SlideOver from "../../../common/components/SlideOver";
import { BulletPoint, WorkExperience } from "../../../common/interfaces/resume";

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
  formData: WorkExperienceForm
): WorkExperience {
  return {
    companyName: formData.companyName,
    companyWebsiteUrl: formData.companyWebsiteUrl ?? null,
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
    bulletPoints: [],
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

interface FormBullet extends BulletPoint {
  shouldDelete: boolean;
}

/**
 * @param experience experience for edit or `null` for a new one.
 * @returns a promise of edited experience or `null` if user cancels.
 */
type OpenWorkExperiencePanel = (
  experience: WorkExperience | null
) => Promise<WorkExperience | null>;

/**
 * @returns edited experience or `null` if user cancels.
 */
type ResolveCallback = (experience: WorkExperience | null) => void;

export default function useWorkExperiencePanel(
  title: string
): [OpenWorkExperiencePanel, React.ReactNode] {
  const [isOpen, setIsOpen] = useState(false);
  const { register, handleSubmit, reset, watch } =
    useForm<WorkExperienceForm>();
  const [bullets, setBullets] = useState<FormBullet[]>([]);
  const resolveCallbackRef = useRef<ResolveCallback | null>(null);

  const openPanel = (
    experience: WorkExperience | null,
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

  const onSubmit: SubmitHandler<WorkExperienceForm> = (formData) => {
    const newExperience = convertFormDataToExperience(formData);
    newExperience.bulletPoints = bullets.filter((b) => !b.shouldDelete);
    resolveCallbackRef.current?.(newExperience);
    closePanel();
  };

  const onCancel = () => {
    resolveCallbackRef.current?.(null);
    closePanel();
  };

  const onError: SubmitErrorHandler<WorkExperienceForm> = (error) =>
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
              required: !watch("isCurrentPosition"),
              disabled: watch("isCurrentPosition"),
            })}
            yearProps={register("endDateYear", {
              required: !watch("isCurrentPosition"),
              disabled: watch("isCurrentPosition"),
            })}
          />
        </div>

        <div className="col-span-6 flex -mt-2">
          <CheckboxField
            label="This is my current position"
            {...register("isCurrentPosition")}
          />
        </div>
      </div>

      <div className="mt-12">
        <h3 className="mb-4 text-base font-medium text-gray-700">
          Bullet points
        </h3>

        <div className="flex flex-col gap-4">
          {bullets.map((bullet, index) => (
            <div key={bullet.id} className="flex items-center gap-2">
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
                  {
                    id: generateId(),
                    text: "",
                    included: true,
                    shouldDelete: false,
                  },
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

function generateId(): string {
  return new Date().getTime().toString();
}
