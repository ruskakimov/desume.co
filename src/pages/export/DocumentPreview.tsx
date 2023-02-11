import classNames from "classnames";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { groupIntoStacks } from "../../common/functions/layout";
import { monthYearToString } from "../../common/functions/time";
import useElementSize from "../../common/hooks/useElementSize";
import {
  Experience,
  PersonalDetails,
  Resume,
  ResumeSectionId,
  SkillGroup,
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
  const [loadedFont, setLoadedFont] = useState("Times");

  const blocksRef = useRef<HTMLDivElement[]>([]);

  function pointsToPx(points: number): number {
    return (points / format.width) * containerSize.width;
  }

  function renderExperienceSectionBlocks<T extends Experience>(
    header: string,
    experiences: T[],
    renderItem: (experience: T, isLast: boolean) => JSX.Element
  ): JSX.Element[] {
    const includedExperiences = experiences.filter((exp) => exp.included);
    if (includedExperiences.length === 0) return [];

    const lastIndex = includedExperiences.length - 1;

    return [
      // Prevent widow header by grouping it with the first item.
      <div>
        <SectionHeader pointsToPx={pointsToPx} text={header} />
        {renderItem(includedExperiences[0], 0 === lastIndex)}
      </div>,
      ...includedExperiences
        .slice(1)
        .map((exp, index) => renderItem(exp, index + 1 === lastIndex)),
    ];
  }

  const renderBySectionId: Record<ResumeSectionId, () => JSX.Element[]> = {
    personal: () => [
      <DetailsSection
        details={resume.personalDetails}
        format={format}
        pointsToPx={pointsToPx}
      />,
    ],
    work: () =>
      renderExperienceSectionBlocks(
        "Work experience",
        resume.workHistory,
        (experience, isLast) => (
          <ExperienceItem
            title={experience.companyName}
            subtitle={experience.jobTitle}
            experience={experience}
            format={format}
            pointsToPx={pointsToPx}
            isLast={isLast}
          />
        )
      ),
    education: () =>
      renderExperienceSectionBlocks(
        "Education",
        resume.educationHistory,
        (education, isLast) => (
          <ExperienceItem
            title={education.schoolName}
            subtitle={education.degree}
            experience={education}
            format={format}
            pointsToPx={pointsToPx}
            isLast={isLast}
          />
        )
      ),
    projects: () =>
      renderExperienceSectionBlocks(
        "Projects",
        resume.projectHistory,
        (project, isLast) => (
          <ExperienceItem
            title={project.projectName}
            experience={project}
            format={format}
            pointsToPx={pointsToPx}
            isLast={isLast}
          />
        )
      ),
    skills: () =>
      resume.skillGroups.length > 0
        ? [
            <div>
              <SkillsSection
                skillGroups={resume.skillGroups}
                format={format}
                pointsToPx={pointsToPx}
              />
            </div>,
          ]
        : [],
  };

  const sectionIds: ResumeSectionId[] = [
    "personal",
    ...resume.sectionOrder
      .filter((section) => section.included)
      .map((section) => section.id),
  ];

  const blocks = sectionIds.map((id) => renderBySectionId[id]()).flat();

  const blocksWithRefs = blocks.map((block, index) =>
    React.cloneElement(block, {
      ref: (ref: any) => (blocksRef.current[index] = ref),
    })
  );

  const marginTopPx = pointsToPx(format.margins.top);
  const marginBottomPx = pointsToPx(format.margins.bottom);
  const footerHeightPx = pointsToPx(36);

  const [pageBlockRanges, setPageBlockRanges] = useState<number[][]>([[0, 0]]);

  useEffect(() => {
    document.fonts
      .load("italic bold 16px Charter")
      .then(() => setLoadedFont("Charter"));
  }, []);

  useLayoutEffect(() => {
    const blockHeights = blocksRef.current.map((el) => {
      const margins =
        parseFloat(el.style.marginTop) ||
        0 + parseFloat(el.style.marginBottom) ||
        0;
      return el.getBoundingClientRect().height + margins;
    });

    const availableHeight = containerSize.height - marginTopPx - marginBottomPx;

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
  }, [containerSize, format, loadedFont]);

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

const SkillsSection: React.FC<{
  skillGroups: SkillGroup[];
  format: DocumentFormat;
  pointsToPx: (points: number) => number;
}> = ({ skillGroups, format, pointsToPx }) => {
  return (
    <div>
      <SectionHeader pointsToPx={pointsToPx} text="Skills" />
      <div
        className="grid grid-cols-4"
        style={{
          fontSize: pointsToPx(format.fontSizes.body),
          lineHeight: format.bulletLineHeight,
          gap: "0.4em",
        }}
      >
        {skillGroups
          .filter((skillGroup) => skillGroup.included)
          .map((skillGroup) => (
            <>
              <div className="font-bold">{skillGroup.groupName}</div>
              <div className="col-span-3">
                {skillGroup.skills
                  .filter((skill) => skill.included)
                  .map((skill) => skill.text)
                  .join(", ")}
              </div>
            </>
          ))}
      </div>
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
        <h1 className="font-bold" style={{ fontSize: pointsToPx(16) }}>
          {details.fullName}
        </h1>
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
    <div ref={ref} style={{ paddingTop: pointsToPx(20) }}>
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
    isLast: boolean;
  }
>(({ pointsToPx, title, subtitle, experience, format, isLast }, ref) => {
  const start = monthYearToString(experience.startDate);
  const end = experience.endDate
    ? monthYearToString(experience.endDate)
    : "Present";

  return (
    <div ref={ref} style={{ paddingBottom: isLast ? 0 : pointsToPx(16) }}>
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
            <li
              key={bullet.id}
              className="flex cursor-pointer rounded hover:bg-yellow-100"
              style={{ marginTop: "0.4em" }}
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
});

export default DocumentPreview;
