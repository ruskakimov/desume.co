import React, { useRef, useState } from "react";
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import CheckboxField from "../../../common/components/fields/CheckboxField";
import MonthYearField from "../../../common/components/fields/MonthYearField";
import TextField from "../../../common/components/fields/TextField";
import WebsiteField from "../../../common/components/fields/WebsiteField";
import SlideOver from "../../../common/components/SlideOver";
import { userCancelReason } from "../../../common/constants/reject-reasons";
import useConfirmationDialog from "../../../common/hooks/useConfirmationDialog";
import useDiscardChangesDialog from "../../../common/hooks/useDiscardChangesDialog";
import { WorkExperience } from "../../../common/interfaces/resume";
import BulletForm, { FormBullet } from "../components/BulletForm";

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

/**
 * @param experience experience for edit or `null` for a new one.
 * @returns a promise of edited experience or `null` if deleted. Promise is rejected if user cancels.
 */
type OpenWorkExperiencePanel = (
  experience: WorkExperience | null
) => Promise<WorkExperience | null>;

type ResolveCallback = (experience: WorkExperience | null) => void;
type RejectCallback = (reason: string) => void;

export default function useWorkExperiencePanel(
  title: string
): [OpenWorkExperiencePanel, React.ReactNode] {
  const [isOpen, setIsOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    getValues,
    formState: { isDirty },
  } = useForm<WorkExperienceForm>();
  const [hasDelete, setHasDelete] = useState(false);
  const [bullets, setBullets] = useState<FormBullet[]>([]);
  const resolveCallbackRef = useRef<ResolveCallback | null>(null);
  const rejectCallbackRef = useRef<RejectCallback | null>(null);

  const [openConfirmationDialog, confirmationDialog] = useConfirmationDialog();
  const [getDiscardConfirmation, discardConfirmationDialog] =
    useDiscardChangesDialog();

  const openPanel = (
    experience: WorkExperience | null,
    onResolve: ResolveCallback,
    onReject: RejectCallback
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
      setHasDelete(true);
    } else {
      // Add experience
      reset();
      setBullets([]);
      setHasDelete(false);
    }
    resolveCallbackRef.current = onResolve;
    rejectCallbackRef.current = onReject;
    setIsOpen(true);
  };

  const closePanel = () => setIsOpen(false);

  const onSubmit: SubmitHandler<WorkExperienceForm> = (formData) => {
    const newExperience = convertFormDataToExperience(formData);
    newExperience.bulletPoints = bullets.filter((b) => !b.shouldDelete);
    resolveCallbackRef.current?.(newExperience);
    closePanel();
  };

  const onCancel = async () => {
    if (!isDirty || (await getDiscardConfirmation())) {
      rejectCallbackRef.current?.(userCancelReason);
      closePanel();
    }
  };

  const onDelete = async () => {
    const jobTitle = getValues("jobTitle");
    const companyName = getValues("companyName");

    const confirmed = await openConfirmationDialog({
      title: "Delete experience",
      body: (
        <p className="text-sm text-gray-500">
          Delete{" "}
          <b>
            {jobTitle} at {companyName}
          </b>
          ? This action cannot be undone.
        </p>
      ),
      action: "Delete",
    });

    if (confirmed) {
      resolveCallbackRef.current?.(null);
      closePanel();
    }
  };

  const currentYear = new Date().getFullYear();

  return [
    (experience) =>
      new Promise((resolve, reject) => {
        openPanel(experience, resolve, reject);
      }),
    <SlideOver
      isOpen={isOpen}
      title={title}
      onClose={onCancel}
      onDelete={hasDelete ? onDelete : undefined}
      onSubmit={handleSubmit(onSubmit)}
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

        <div className="col-span-6 flex -mt-2">
          <CheckboxField
            label="This is my current position"
            {...register("isCurrentPosition")}
          />
        </div>
      </div>
      <BulletForm bullets={bullets} onChange={setBullets} />

      {discardConfirmationDialog}
      {confirmationDialog}
    </SlideOver>,
  ];
}
