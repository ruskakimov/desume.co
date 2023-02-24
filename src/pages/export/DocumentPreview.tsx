import classNames from "classnames";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { userCancelReason } from "../../common/constants/reject-reasons";
import { withRemovedAt, withReplacedAt } from "../../common/functions/array";
import { groupIntoStacks } from "../../common/functions/layout";
import { monthYearToString } from "../../common/functions/time";
import useElementSize from "../../common/hooks/useElementSize";
import {
  EducationExperience,
  Experience,
  PersonalDetails,
  ProjectExperience,
  Resume,
  ResumeSectionId,
  SkillGroup,
  WorkExperience,
} from "../../common/interfaces/resume";
import { rectMarkerClass } from "../../pdf/generatePdfFromHtml";
import useBulletFlow from "../content/components/bullet-modal/useBulletFlow";
import { useEducation } from "../content/education/EducationSection";
import { useProjects } from "../content/projects/ProjectsSection";
import { useWorkHistory } from "../content/work-history/WorkHistorySection";

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
  spacingMultiplier: number;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  resume,
  format,
  pagesRef,
}) => {
  const [_, setWorkHistory] = useWorkHistory();
  const [__, setEducation] = useEducation();
  const [___, setProjects] = useProjects();

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
    renderItem: (experience: T, index: number, isLast: boolean) => JSX.Element
  ): JSX.Element[] {
    const includedExperiences = experiences.filter((exp) => exp.included);
    if (includedExperiences.length === 0) return [];

    const lastIndex = includedExperiences.length - 1;

    return [
      // Prevent widow header by grouping it with the first item.
      <div>
        <SectionHeader pointsToPx={pointsToPx} format={format} text={header} />
        {renderItem(includedExperiences[0], 0, 0 === lastIndex)}
      </div>,
      ...includedExperiences
        .slice(1)
        .map((exp, index) =>
          renderItem(exp, index + 1, index + 1 === lastIndex)
        ),
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
        (experience, index, isLast) => (
          <ExperienceItem
            title={experience.companyName}
            subtitle={experience.jobTitle}
            experience={experience}
            onChange={(editedExperience) => {
              setWorkHistory(
                withReplacedAt(
                  resume.workHistory,
                  index,
                  editedExperience as WorkExperience
                )
              );
            }}
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
        (education, index, isLast) => (
          <ExperienceItem
            title={education.schoolName}
            subtitle={education.degree}
            experience={education}
            onChange={(editedEducation) => {
              setEducation(
                withReplacedAt(
                  resume.educationHistory,
                  index,
                  editedEducation as EducationExperience
                )
              );
            }}
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
        (project, index, isLast) => (
          <ExperienceItem
            title={project.projectName}
            experience={project}
            onChange={(editedProject) => {
              setProjects(
                withReplacedAt(
                  resume.projectHistory,
                  index,
                  editedProject as ProjectExperience
                )
              );
            }}
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
      <SectionHeader pointsToPx={pointsToPx} format={format} text="Skills" />
      <div
        className="grid grid-cols-[auto_1fr]"
        style={{
          fontSize: pointsToPx(format.fontSizes.body),
          lineHeight: Math.max(1.25, 1.4 * format.spacingMultiplier),
          columnGap: "1em",
          rowGap:
            0.4 * pointsToPx(format.fontSizes.body) * format.spacingMultiplier,
        }}
      >
        {skillGroups
          .filter((skillGroup) => skillGroup.included)
          .map((skillGroup) => (
            <>
              <div className="font-bold">{skillGroup.groupName}</div>
              <div>
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
    format: DocumentFormat;
  }
>(({ pointsToPx, text, format }, ref) => {
  return (
    <div
      ref={ref}
      style={{ paddingTop: pointsToPx(20) * format.spacingMultiplier }}
    >
      <div
        className={classNames(rectMarkerClass, "bg-black")}
        style={{ height: pointsToPx(0.6) }}
      />
      <p
        className="font-bold"
        style={{
          fontSize: pointsToPx(8),
          paddingTop: pointsToPx(4) * format.spacingMultiplier,
          paddingBottom: pointsToPx(8) * format.spacingMultiplier,
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
    onChange: (experience: Experience) => void;
    format: DocumentFormat;
    isLast: boolean;
  }
>(
  (
    { pointsToPx, title, subtitle, experience, onChange, format, isLast },
    ref
  ) => {
    const start = monthYearToString(experience.startDate);
    const end = experience.endDate
      ? monthYearToString(experience.endDate)
      : "Present";

    const [openBulletModal, bulletModal] = useBulletFlow();

    return (
      <div
        ref={ref}
        style={{
          paddingBottom: isLast ? 0 : pointsToPx(16) * format.spacingMultiplier,
        }}
      >
        <div
          className="flex justify-between"
          style={{ fontSize: pointsToPx(format.fontSizes.header) }}
        >
          <label className="font-bold" style={{ paddingRight: pointsToPx(10) }}>
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
            lineHeight: Math.max(1.25, 1.4 * format.spacingMultiplier),
          }}
        >
          {experience.bulletPoints
            .filter((bullet) => bullet.included)
            .map((bullet, index) => (
              <li
                key={bullet.id}
                className="flex cursor-pointer rounded hover:bg-yellow-100"
                style={{
                  marginTop:
                    0.4 *
                    pointsToPx(format.fontSizes.body) *
                    format.spacingMultiplier,
                }}
                onClick={() => {
                  openBulletModal(bullet)
                    .then((editedBullet) => {
                      if (editedBullet) {
                        onChange({
                          ...experience,
                          bulletPoints: withReplacedAt(
                            experience.bulletPoints,
                            index,
                            editedBullet
                          ),
                        });
                      } else {
                        onChange({
                          ...experience,
                          bulletPoints: withRemovedAt(
                            experience.bulletPoints,
                            index
                          ),
                        });
                      }
                    })
                    .catch((e) => {
                      if (e !== userCancelReason) console.error(e);
                    });
                }}
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

        {bulletModal}
      </div>
    );
  }
);

export default DocumentPreview;
