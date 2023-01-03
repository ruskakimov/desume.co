import classNames from "classnames";
import React from "react";
import { monthYearToString } from "../../common/functions/time";
import useElementSize from "../../common/hooks/useElementSize";
import {
  Experience,
  PersonalDetails,
  Resume,
} from "../../common/interfaces/resume";
import { rectMarkerClass } from "../../pdf/generatePdfFromHtml";

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
  bulletLineHeight: number;
}

const DocumentPreview = React.forwardRef<HTMLDivElement, DocumentPreviewProps>(
  ({ resume, format }, ref) => {
    const aspectRatio = format.width / format.height;

    const [containerRef, containerSize] = useElementSize([
      format.margins.top,
      format.margins.left,
      format.margins.right,
      format.margins.bottom,
    ]);

    function pointsToPx(points: number): number {
      return (points / format.width) * containerSize.width;
    }

    return (
      <div
        ref={containerRef}
        className="bg-white shadow text-black antialiased overflow-hidden"
      >
        <div
          ref={ref}
          style={{
            aspectRatio: aspectRatio,
            fontFamily: "Charter, Times",
            paddingTop: pointsToPx(format.margins.top),
            paddingLeft: pointsToPx(format.margins.left),
            paddingRight: pointsToPx(format.margins.right),
            paddingBottom: pointsToPx(format.margins.bottom),
          }}
        >
          <DetailsSection
            details={resume.personalDetails}
            format={format}
            pointsToPx={pointsToPx}
          />

          <SectionHeader pointsToPx={pointsToPx} text="Work history" />
          {resume.workHistory
            .filter((experience) => experience.included)
            .map((experience) => {
              return (
                <ExperienceItem
                  title={experience.companyName}
                  subtitle={experience.jobTitle}
                  experience={experience}
                  format={format}
                  pointsToPx={pointsToPx}
                />
              );
            })}

          <SectionHeader pointsToPx={pointsToPx} text="Education" />
          {resume.educationHistory
            .filter((experience) => experience.included)
            .map((experience) => {
              return (
                <ExperienceItem
                  title={experience.schoolName}
                  subtitle={experience.degree}
                  experience={experience}
                  format={format}
                  pointsToPx={pointsToPx}
                />
              );
            })}

          <SectionHeader pointsToPx={pointsToPx} text="Projects" />
          {resume.projectHistory
            .filter((experience) => experience.included)
            .map((experience) => {
              return (
                <ExperienceItem
                  title={experience.projectName}
                  experience={experience}
                  format={format}
                  pointsToPx={pointsToPx}
                />
              );
            })}
        </div>
      </div>
    );
  }
);

const DetailsSection: React.FC<{
  details: PersonalDetails;
  format: DocumentFormat;
  pointsToPx: (points: number) => number;
}> = ({ pointsToPx, details, format }) => {
  return (
    <div className="flex justify-between">
      <div>
        <h1 style={{ fontSize: pointsToPx(16) }}>{details.fullName}</h1>
        <h2 style={{ fontSize: pointsToPx(format.fontSizes.header) }}>
          {details.title}
        </h2>
      </div>

      <ul
        className="text-right"
        style={{ fontSize: pointsToPx(format.fontSizes.body) }}
      >
        {[
          details.email,
          details.phoneNumber,
          details.websiteUrl,
          details.location,
        ]
          .map((text) => text.trim())
          .filter((text) => text.length > 0)
          .map((text) => (
            <li>{text}</li>
          ))}
      </ul>
    </div>
  );
};

const SectionHeader: React.FC<{
  pointsToPx: (points: number) => number;
  text: string;
}> = ({ pointsToPx, text }) => {
  return (
    <>
      <div
        className={classNames(rectMarkerClass, "bg-black")}
        style={{ marginTop: pointsToPx(20), height: pointsToPx(0.6) }}
      />
      <p
        className="font-bold"
        style={{
          fontSize: pointsToPx(8),
          marginTop: pointsToPx(4),
          marginBottom: pointsToPx(8),
          letterSpacing: pointsToPx(0.5),
        }}
      >
        {text.toUpperCase()}
      </p>
    </>
  );
};

const ExperienceItem: React.FC<{
  pointsToPx: (points: number) => number;
  title: string;
  subtitle?: string;
  experience: Experience;
  format: DocumentFormat;
}> = ({ pointsToPx, title, subtitle, experience, format }) => {
  const start = monthYearToString(experience.startDate);
  const end = experience.endDate
    ? monthYearToString(experience.endDate)
    : "Current";

  return (
    <div style={{ marginBottom: pointsToPx(16) }}>
      <div
        className="flex justify-between"
        style={{ fontSize: pointsToPx(format.fontSizes.header) }}
      >
        <label className="font-bold" style={{ marginRight: pointsToPx(6) }}>
          {title}
        </label>

        <label>{`${start} – ${end}`}</label>
      </div>

      {subtitle && (
        <div
          className="flex justify-between"
          style={{ fontSize: pointsToPx(format.fontSizes.body) }}
        >
          <label className="italic">{subtitle}</label>
          {/* <label>Kuala-Lumpur, Malaysia</label> */}
        </div>
      )}

      <ul
        style={{
          fontSize: pointsToPx(format.fontSizes.body),
          lineHeight: format.bulletLineHeight,
        }}
      >
        {experience.bulletPoints
          .filter((bullet) => bullet.included)
          .map((bullet) => (
            <li key={bullet.id} className="flex" style={{ marginTop: "0.4em" }}>
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
};

export default DocumentPreview;
