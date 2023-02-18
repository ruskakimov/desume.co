import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useContextResume } from "../../AppShell";
import Card from "../../common/components/Card";
import SelectField, {
  SelectOption,
} from "../../common/components/fields/SelectField";
import PrimaryButton from "../../common/components/PrimaryButton";
import { PageSizeName, pageSizes } from "../../common/constants/page-sizes";
import { generatePdfFromHtml } from "../../pdf/generatePdfFromHtml";
import DocumentPreview from "./DocumentPreview";

const pageSizeOptions: SelectOption<PageSizeName>[] = [
  {
    label: "A4",
    value: "a4",
  },
  {
    label: "US letter",
    value: "us-letter",
  },
];

type BulletLineHeight = "1.4" | "1.25";

const bulletSpacingOptions: SelectOption<BulletLineHeight>[] = [
  {
    label: "Comfortable",
    value: "1.4",
  },
  {
    label: "Compact",
    value: "1.25",
  },
];

type VerticalMarginPts = "36" | "54" | "72";

const verticalMarginsOptions: SelectOption<VerticalMarginPts>[] = [
  {
    label: "0.5 inch",
    value: "36",
  },
  {
    label: "0.75 inch",
    value: "54",
  },
  {
    label: "1 inch",
    value: "72",
  },
];

type HorizontalMarginPts = "36" | "45" | "54" | "63" | "72" | "81" | "90";

const horizontalMarginsOptions: SelectOption<HorizontalMarginPts>[] = [
  {
    label: "0.5 inch",
    value: "36",
  },
  {
    label: "0.625 inch",
    value: "45",
  },
  {
    label: "0.75 inch",
    value: "54",
  },
  {
    label: "0.875 inch",
    value: "63",
  },
  {
    label: "1 inch",
    value: "72",
  },
  {
    label: "1.125 inches",
    value: "81",
  },
  {
    label: "1.25 inches",
    value: "90",
  },
];

interface ExportOptionsForm {
  pageSize: PageSizeName;
  bulletSpacing: BulletLineHeight;
  verticalMargins: VerticalMarginPts;
  horizontalMargins: HorizontalMarginPts;
}

const defaultFormValues: ExportOptionsForm = {
  pageSize: "a4",
  bulletSpacing: "1.4",
  verticalMargins: "54",
  horizontalMargins: "63",
};

const formStorageKey = "export-form";

function getSavedFormData(): ExportOptionsForm {
  const serialized = localStorage.getItem(formStorageKey);
  if (!serialized) return defaultFormValues;

  const parsed: unknown = JSON.parse(serialized);
  if (!isFormData(parsed)) return defaultFormValues;

  return Object.assign({ ...defaultFormValues }, parsed);
}

function isFormData(obj: unknown): obj is Partial<ExportOptionsForm> {
  return typeof obj === "object" && obj !== null;
}

const ExportPage: React.FC = () => {
  const [resume] = useContextResume();
  const { register, watch, getValues } = useForm<ExportOptionsForm>({
    defaultValues: getSavedFormData(),
  });
  const pagesRef = useRef<HTMLDivElement[]>([]);

  const pageSize = watch("pageSize");
  const bulletSpacing = parseFloat(watch("bulletSpacing"));
  const verticalMargins = parseFloat(watch("verticalMargins"));
  const horizontalMargins = parseFloat(watch("horizontalMargins"));

  // Save to local storage.
  useEffect(() => {
    const formData = getValues();
    localStorage.setItem(formStorageKey, JSON.stringify(formData));
  }, [pageSize, bulletSpacing, verticalMargins, horizontalMargins]);

  return (
    <div className="pb-8 lg:grid lg:grid-cols-[16rem_1fr] lg:gap-x-5">
      <div className="mb-8 lg:mb-0">
        <Card>
          <SelectField
            label="Page size"
            options={pageSizeOptions}
            {...register("pageSize")}
          />

          <SelectField
            label="Bullet spacing"
            options={bulletSpacingOptions}
            {...register("bulletSpacing")}
          />

          <SelectField
            label="Vertical margins"
            options={verticalMarginsOptions}
            {...register("verticalMargins")}
          />

          <SelectField
            label="Horizontal margins"
            options={horizontalMarginsOptions}
            {...register("horizontalMargins")}
          />

          <PrimaryButton
            className="w-full"
            onClick={() => {
              if (pagesRef.current) {
                generatePdfFromHtml(pagesRef.current, pageSize).save();
              }
            }}
          >
            Download PDF
          </PrimaryButton>
        </Card>
      </div>

      {resume ? (
        <DocumentPreview
          pagesRef={pagesRef}
          resume={resume}
          format={{
            width: pageSizes[pageSize].width,
            height: pageSizes[pageSize].height,
            margins: {
              top: verticalMargins,
              left: horizontalMargins,
              right: horizontalMargins,
              bottom: verticalMargins,
            },
            fontSizes: {
              header: 12,
              body: 10,
            },
            bulletLineHeight: bulletSpacing,
          }}
        />
      ) : (
        <div
          className="shimmer bg-gray-200 animate-pulse"
          style={{
            aspectRatio: pageSizes[pageSize].width / pageSizes[pageSize].height,
          }}
        />
      )}
    </div>
  );
};

export default ExportPage;
