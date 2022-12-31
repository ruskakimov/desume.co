import { useRef } from "react";
import { useContextResume } from "../../AppShell";
import PrimaryButton from "../../common/components/PrimaryButton";
import { generatePdfFromHtml } from "../../pdf/generatePdfFromHtml";
import DocumentPreview from "./DocumentPreview";

const ExportPage: React.FC = () => {
  const [resume] = useContextResume();

  const docPreviewRef = useRef<HTMLDivElement>(null);

  return (
    <div className="lg:grid lg:grid-cols-[16rem_1fr] lg:gap-x-5">
      <div>
        <PrimaryButton
          className="w-full"
          onClick={() => {
            const el = docPreviewRef.current;
            if (el) {
              generatePdfFromHtml(el).save();
            }
          }}
        >
          Download PDF
        </PrimaryButton>
      </div>

      {resume && <DocumentPreview resume={resume} />}
    </div>
  );
};

export default ExportPage;
