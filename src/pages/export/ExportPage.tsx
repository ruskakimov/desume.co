import { useRef } from "react";
import PrimaryButton from "../../common/components/PrimaryButton";
import { monthYearToString } from "../../common/functions/time";
import { generatePdfFromHtml } from "../../pdf/generatePdfFromHtml";
import { a4SizeInPoints } from "../../pdf/render-tests/build/common/constants/sizes";
import { useAppSelector } from "../../redux/store";

const ExportPage: React.FC = () => {
  const resume = useAppSelector((state) => state.content.resume);
  const { width, height } = a4SizeInPoints;

  const docPreview = useRef<HTMLDivElement>(null);

  return (
    <div>
      <h1>Export</h1>

      <PrimaryButton
        className="my-4"
        onClick={() => {
          const el = docPreview.current;
          if (el) {
            generatePdfFromHtml(el).save();
          }
        }}
      >
        Download PDF
      </PrimaryButton>

      <div
        ref={docPreview}
        className="bg-white shadow p-8"
        style={{ width, height, fontFamily: "Times" }}
      >
        {resume?.workHistory.map((experience) => {
          const start = monthYearToString(experience.startDate);
          const end = experience.endDate
            ? monthYearToString(experience.endDate)
            : "Current";

          return (
            <div className="flex gap-1 text-sm m-4">
              <label className="font-bold">{experience.companyName}</label>
              <label>{experience.jobTitle}</label>
              <label className="ml-auto">{`${start} – ${end}`}</label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExportPage;
