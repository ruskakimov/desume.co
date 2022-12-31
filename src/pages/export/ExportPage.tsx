import { useRef } from "react";
import { useContextResume } from "../../AppShell";
import PrimaryButton from "../../common/components/PrimaryButton";
import { generatePdfFromHtml } from "../../pdf/generatePdfFromHtml";
import { a4SizeInPoints } from "../../pdf/render-tests/build/common/constants/sizes";
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
          resume={resume}
          format={{
            width: a4SizeInPoints.width,
            height: a4SizeInPoints.height,
            margins: {
              top: 48,
              left: 48,
              right: 48,
              bottom: 48,
            },
            bodyFontSize: 12,
          }}
        />
      )}
    </div>
  );
};

export default ExportPage;
