import classNames from "classnames";
import React, { useLayoutEffect, useRef, useState } from "react";
import { groupIntoStacks } from "../../common/functions/layout";
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
  pagesRef: React.MutableRefObject<HTMLDivElement[]>;
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

const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  resume,
  format,
  pagesRef,
}) => {
  const aspectRatio = format.width / format.height;

  const [containerRef, containerSize] = useElementSize([
    format.margins.top,
    format.margins.left,
    format.margins.right,
    format.margins.bottom,
  ]);

  const blocksRef = useRef<HTMLDivElement[]>([]);

  function pointsToPx(points: number): number {
    return (points / format.width) * containerSize.width;
  }

  function renderExperienceSectionBlocks<T extends Experience>(
    header: string,
    experiences: T[],
    renderItem: (experience: T) => JSX.Element
  ): JSX.Element[] {
    const includedExperiences = experiences.filter((exp) => exp.included);
    if (includedExperiences.length === 0) return [];

    return [
      // Prevent widow header by grouping it with the first item.
      <div style={{ marginTop: pointsToPx(20) }}>
        <SectionHeader pointsToPx={pointsToPx} text={header} />
        {renderItem(includedExperiences[0])}
      </div>,
      ...includedExperiences.slice(1).map(renderItem),
    ];
  }

  const blocks = [
    <DetailsSection
      details={resume.personalDetails}
      format={format}
      pointsToPx={pointsToPx}
    />,

    ...renderExperienceSectionBlocks(
      "Work experience",
      resume.workHistory,
      (experience) => (
        <ExperienceItem
          title={experience.companyName}
          subtitle={experience.jobTitle}
          experience={experience}
          format={format}
          pointsToPx={pointsToPx}
        />
      )
    ),

    ...renderExperienceSectionBlocks(
      "Education",
      resume.educationHistory,
      (education) => (
        <ExperienceItem
          title={education.schoolName}
          subtitle={education.degree}
          experience={education}
          format={format}
          pointsToPx={pointsToPx}
        />
      )
    ),

    ...renderExperienceSectionBlocks(
      "Projects",
      resume.projectHistory,
      (project) => (
        <ExperienceItem
          title={project.projectName}
          experience={project}
          format={format}
          pointsToPx={pointsToPx}
        />
      )
    ),
  ];

  const blocksWithRefs = blocks.map((block, index) =>
    React.cloneElement(block, {
      ref: (ref: any) => (blocksRef.current[index] = ref),
    })
  );

  const marginTopPx = pointsToPx(format.margins.top);
  const marginBottomPx = pointsToPx(format.margins.bottom);
  const footerHeightPx = pointsToPx(36);

  const [pageBlockRanges, setPageBlockRanges] = useState<number[][]>([[0, 0]]);

  useLayoutEffect(() => {
    const blockHeights = blocksRef.current.map((el) => {
      const margins =
        parseFloat(el.style.marginTop) ||
        0 + parseFloat(el.style.marginBottom) ||
        0;
      return el.getBoundingClientRect().height + margins;
    });

    const availableHeight = containerSize.height - marginTopPx - marginBottomPx;

    console.log(blockHeights.reduce((acc, h) => acc + h, 0));
    console.log(blocksRef.current, blockHeights);

    const pagesWithoutFooter = groupIntoStacks(blockHeights, availableHeight);
    const pagesWithFooter = groupIntoStacks(
      blockHeights,
      availableHeight - footerHeightPx
    );

    if (pagesWithoutFooter.length === 1) {
      setPageBlockRanges(pagesWithoutFooter);
    } else {
      setPageBlockRanges(pagesWithFooter);
    }
  }, [containerSize, format]);

  const pageStyle = {
    aspectRatio: aspectRatio,
    fontFamily: "Charter, Times",
    paddingTop: marginTopPx,
    paddingLeft: pointsToPx(format.margins.left),
    paddingRight: pointsToPx(format.margins.right),
    paddingBottom: marginBottomPx,
    overflow: "hidden",
  };

  return (
    <div className="relative">
      {/* This invisible page is for measuring page content area and block heights. */}
      <div
        ref={containerRef}
        className="w-full absolute invisible"
        style={pageStyle}
      >
        {blocksWithRefs}
      </div>

      {pageBlockRanges.map(([start, end], pageIndex) => (
        <div
          ref={(el) => {
            // Erases old references if previous list is longer.
            if (pageIndex === 0 && el) pagesRef.current = [];

            if (el) pagesRef.current[pageIndex] = el;
          }}
          className="mb-8 bg-white shadow text-black antialiased flex flex-col"
          style={pageStyle}
        >
          {blocks.slice(start, end)}

          {pageBlockRanges.length > 1 && (
            <Footer
              name={resume.personalDetails.fullName}
              pageNumber={pageIndex + 1}
              pageCount={pageBlockRanges.length}
              height={footerHeightPx}
              pointsToPx={pointsToPx}
            />
          )}
        </div>
      ))}
    </div>
  );
};

const Footer: React.FC<{
  name: string;
  pageNumber: number;
  pageCount: number;
  height: number;
  pointsToPx: (points: number) => number;
}> = ({ name, pageNumber, pageCount, height, pointsToPx }) => {
  return (
    <div
      className="mt-auto flex justify-center items-end"
      style={{
        height,
        fontSize: pointsToPx(8),
        letterSpacing: pointsToPx(0.5),
      }}
    >
      {`${name} résumé — page ${pageNumber} of ${pageCount}`.toUpperCase()}
    </div>
  );
};

const DetailsSection = React.forwardRef<
  HTMLDivElement,
  {
    details: PersonalDetails;
    format: DocumentFormat;
    pointsToPx: (points: number) => number;
  }
>(({ pointsToPx, details, format }, ref) => {
  return (
    <div ref={ref} className="flex justify-between">
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
});

const SectionHeader = React.forwardRef<
  HTMLDivElement,
  {
    pointsToPx: (points: number) => number;
    text: string;
  }
>(({ pointsToPx, text }, ref) => {
  return (
    <div ref={ref}>
      <div
        className={classNames(rectMarkerClass, "bg-black")}
        style={{ height: pointsToPx(0.6) }}
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
    </div>
  );
});

const ExperienceItem = React.forwardRef<
  HTMLDivElement,
  {
    pointsToPx: (points: number) => number;
    title: string;
    subtitle?: string;
    experience: Experience;
    format: DocumentFormat;
  }
>(({ pointsToPx, title, subtitle, experience, format }, ref) => {
  const start = monthYearToString(experience.startDate);
  const end = experience.endDate
    ? monthYearToString(experience.endDate)
    : "Current";

  return (
    <div ref={ref} style={{ paddingBottom: pointsToPx(16) }}>
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
});

export default DocumentPreview;
