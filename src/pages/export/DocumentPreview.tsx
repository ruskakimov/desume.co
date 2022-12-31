import React from "react";
import { a4SizeInPoints } from "../../common/constants/sizes";
import { monthYearToString } from "../../common/functions/time";
import { Resume } from "../../common/interfaces/resume";

interface DocumentPreviewProps {
  resume: Resume;
}

const DocumentPreview = React.forwardRef<HTMLDivElement, DocumentPreviewProps>(
  ({ resume }, ref) => {
    const { width, height } = a4SizeInPoints;

    return (
      <div
        ref={ref}
        className="bg-white shadow p-8"
        style={{
          width,
          height,
          fontFamily: "Times",
          WebkitFontSmoothing: "auto",
        }}
      >
        {resume?.workHistory
          .filter((experience) => experience.included)
          .map((experience) => {
            const start = monthYearToString(experience.startDate);
            const end = experience.endDate
              ? monthYearToString(experience.endDate)
              : "Current";

            return (
              <div className="my-8">
                <div className="flex gap-1 text-sm">
                  <label className="font-bold">{experience.companyName}</label>
                  <label>{experience.jobTitle}</label>
                  <label className="ml-auto">{`${start} – ${end}`}</label>
                </div>

                <ul className="text-xs">
                  {experience.bulletPoints
                    .filter((bullet) => bullet.included)
                    .map((bullet) => (
                      <li key={bullet.id} className="my-1">
                        &bull; {bullet.text}
                      </li>
                    ))}
                </ul>
              </div>
            );
          })}
      </div>
    );
  }
);

export default DocumentPreview;
