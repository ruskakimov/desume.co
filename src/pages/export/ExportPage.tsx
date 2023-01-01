import { useRef } from "react";
import { useContextResume } from "../../AppShell";
import PrimaryButton from "../../common/components/PrimaryButton";
import { a4SizeInPoints } from "../../common/constants/sizes";
import { generatePdfFromHtml } from "../../pdf/generatePdfFromHtml";
import DocumentPreview from "./DocumentPreview";

const ExportPage: React.FC = () => {
  const [resume] = useContextResume();

  const docPreviewRef = useRef<HTMLDivElement>(null);

  return (
    <div className="pb-8 lg:grid lg:grid-cols-[16rem_1fr] lg:gap-x-5">
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

      {resume && (
        <DocumentPreview
          ref={docPreviewRef}
          resume={resume}
          format={{
            width: a4SizeInPoints.width,
            height: a4SizeInPoints.height,
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
          }}
        />
      )}
    </div>
  );
};

export default ExportPage;
