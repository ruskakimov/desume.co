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
    value: "1.2",
  },
];

interface ExportOptionsForm {
  pageSize: PageSizeName;
  bulletSpacing: string;
}

const ExportPage: React.FC = () => {
  const [resume] = useContextResume();
  const { register, watch } = useForm<ExportOptionsForm>();
  const docPreviewRef = useRef<HTMLDivElement>(null);

  const pageSize = watch("pageSize");
  const bulletSpacing = parseFloat(watch("bulletSpacing"));

  return (
    <div className="pb-8 lg:grid lg:grid-cols-[16rem_1fr] lg:gap-x-5">
      <div className="mb-8 lg:mb-0">
        <Card>
          <SelectField
            label="Page size"
            defaultValue={pageSizeOptions[0].value}
            options={pageSizeOptions}
            {...register("pageSize")}
          />

          <SelectField
            label="Bullet spacing"
            defaultValue={bulletSpacingOptions[0].value}
            options={bulletSpacingOptions}
            {...register("bulletSpacing")}
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
              top: 50,
              left: 100,
              right: 100,
              bottom: 50,
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
