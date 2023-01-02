import { useRef } from "react";
import { useContextResume } from "../../AppShell";
import Card from "../../common/components/Card";
import SelectField from "../../common/components/fields/SelectField";
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

const ExportPage: React.FC = () => {
  const [resume] = useContextResume();

  const docPreviewRef = useRef<HTMLDivElement>(null);

  return (
    <div className="pb-8 lg:grid lg:grid-cols-[16rem_1fr] lg:gap-x-5">
      <div className="mb-8 lg:mb-0">
        <Card>
          <SelectField
            label="Page size"
            defaultValue={pageSizeOptions[0].value}
            options={pageSizeOptions}
          />

          <PrimaryButton
            className="w-full"
            onClick={() => {
              const el = docPreviewRef.current;
              if (el) {
                generatePdfFromHtml(el, "a4").save();
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
            width: pageSizes.a4.width,
            height: pageSizes.a4.height,
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
            bulletLineHeight: 1.2,
          }}
        />
      )}
    </div>
  );
};

export default ExportPage;
