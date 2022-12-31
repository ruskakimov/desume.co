import { useRef } from "react";
import { useContextResume } from "../../AppShell";
import PrimaryButton from "../../common/components/PrimaryButton";
import { generatePdfFromHtml } from "../../pdf/generatePdfFromHtml";
import DocumentPreview from "./DocumentPreview";

const ExportPage: React.FC = () => {
  const [resume] = useContextResume();

  const docPreviewRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <h1>Export</h1>

      <PrimaryButton
        className="my-4"
        onClick={() => {
          const el = docPreviewRef.current;
          if (el) {
            generatePdfFromHtml(el).save();
          }
        }}
      >
        Download PDF
      </PrimaryButton>

      {resume && <DocumentPreview resume={resume} />}
    </div>
  );
};

export default ExportPage;
