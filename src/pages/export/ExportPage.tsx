import { useRef } from "react";
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

const pageSizeOptions: { label: string; value: PageSizeName }[] = [
  {
    label: "A4",
    value: "a4",
  },
  {
    label: "US letter",
    value: "us-letter",
  },
];

const bulletSpacingOptions: SelectOption[] = [
  {
    label: "Comfortable",
    value: "1.4",
  },
  {
    label: "Compact",
    value: "1.25",
  },
];

const verticalMarginsOptions: SelectOption[] = [
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

const horizontalMarginsOptions: SelectOption[] = [
  {
    label: "1 inch",
    value: "72",
  },
  {
    label: "1.25 inches",
    value: "90",
  },
  {
    label: "1.5 inches",
    value: "108",
  },
];

const defaultPageSize = pageSizeOptions[0].value;
const defaultBulletSpacing = bulletSpacingOptions[0].value;
const defaultVerticalMargins = verticalMarginsOptions[1].value;
const defaultHorizontalMargins = horizontalMarginsOptions[1].value;

interface ExportOptionsForm {
  pageSize?: PageSizeName;
  bulletSpacing?: string;
  verticalMargins?: string;
  horizontalMargins?: string;
}

const ExportPage: React.FC = () => {
  const [resume] = useContextResume();
  const { register, watch } = useForm<ExportOptionsForm>();
  const docPreviewRef = useRef<HTMLDivElement>(null);

  const pageSize = watch("pageSize") ?? defaultPageSize;
  const bulletSpacing = parseFloat(
    watch("bulletSpacing") ?? defaultBulletSpacing
  );
  const verticalMargins = parseFloat(
    watch("verticalMargins") ?? defaultVerticalMargins
  );
  const horizontalMargins = parseFloat(
    watch("horizontalMargins") ?? defaultHorizontalMargins
  );

  return (
    <div className="pb-8 lg:grid lg:grid-cols-[16rem_1fr] lg:gap-x-5">
      <div className="mb-8 lg:mb-0">
        <Card>
          <SelectField
            label="Page size"
            defaultValue={defaultPageSize}
            options={pageSizeOptions}
            {...register("pageSize")}
          />

          <SelectField
            label="Bullet spacing"
            defaultValue={defaultBulletSpacing}
            options={bulletSpacingOptions}
            {...register("bulletSpacing")}
          />

          <SelectField
            label="Vertical margins"
            defaultValue={defaultVerticalMargins}
            options={verticalMarginsOptions}
            {...register("verticalMargins")}
          />

          <SelectField
            label="Horizontal margins"
            defaultValue={defaultHorizontalMargins}
            options={horizontalMarginsOptions}
            {...register("horizontalMargins")}
          />

          <PrimaryButton
            className="w-full"
            onClick={() => {
              const el = docPreviewRef.current;
              if (el) {
                generatePdfFromHtml(el, pageSize).save();
              }
            }}
          >
            Download PDF
          </PrimaryButton>
        </Card>
      </div>

      {resume && (
        <DocumentPreview
          ref={docPreviewRef}
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
      )}
    </div>
  );
};

export default ExportPage;
