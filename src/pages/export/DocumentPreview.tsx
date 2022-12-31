import React from "react";
import { monthYearToString } from "../../common/functions/time";
import useElementSize from "../../common/hooks/useElementSize";
import { Resume } from "../../common/interfaces/resume";

interface DocumentPreviewProps {
  resume: Resume;
  format: DocumentFormat;
}

/**
 * All measurements are in points.
 */
interface DocumentFormat {
  width: number;
  height: number;
  margins: {
    top: number;
    left: number;
    right: number;
    bottom: number;
  };
  fontSizes: {
    header: number;
    body: number;
  };
}

const DocumentPreview = React.forwardRef<HTMLDivElement, DocumentPreviewProps>(
  ({ resume, format }, ref) => {
    const aspectRatio = format.width / format.height;

    const [containerRef, containerSize] = useElementSize();

    function pointsToPx(points: number): number {
      return (points / format.width) * containerSize.width;
    }

    const marginTopPx = pointsToPx(format.margins.top);
    const marginLeftPx = pointsToPx(format.margins.left);
    const marginRightPx = pointsToPx(format.margins.right);
    const marginBottomPx = pointsToPx(format.margins.bottom);
    const headerFontSizePx = pointsToPx(format.fontSizes.header);
    const bodyFontSizePx = pointsToPx(format.fontSizes.body);

    return (
      <div ref={containerRef}>
        <div
          ref={ref}
          className="bg-white shadow"
          style={{
            aspectRatio: aspectRatio,
            fontFamily: "Times",
            paddingTop: marginTopPx,
            paddingLeft: marginLeftPx,
            paddingRight: marginRightPx,
            paddingBottom: marginBottomPx,
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
                  <div className="flex" style={{ fontSize: headerFontSizePx }}>
                    <label
                      className="font-bold"
                      style={{ marginRight: pointsToPx(6) }}
                    >
                      {experience.companyName}
                    </label>
                    <label>{experience.jobTitle}</label>
                    <label className="ml-auto">{`${start} – ${end}`}</label>
                  </div>

                  <ul style={{ fontSize: bodyFontSizePx }}>
                    {experience.bulletPoints
                      .filter((bullet) => bullet.included)
                      .map((bullet) => (
                        <li
                          key={bullet.id}
                          className="flex"
                          style={{ marginTop: pointsToPx(4) }}
                        >
                          <span
                            style={{
                              marginRight: pointsToPx(8),
                            }}
                          >
                            &bull;
                          </span>
                          {bullet.text}
                        </li>
                      ))}
                  </ul>
                </div>
              );
            })}
        </div>
      </div>
    );
  }
);

export default DocumentPreview;
