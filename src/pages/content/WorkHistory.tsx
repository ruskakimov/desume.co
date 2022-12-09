import Card from "../../common/components/Card";
import Checkbox from "../../common/components/Checkbox";
import MonthYearField from "../../common/components/fields/MonthYearField";
import TextField from "../../common/components/fields/TextField";
import WebsiteField from "../../common/components/fields/WebsiteField";
import PrimaryButton from "../../common/components/PrimaryButton";
import { WorkExperience } from "../../common/interfaces/resume";

interface WorkHistoryProps {
  experiences: WorkExperience[];
}

const WorkHistory: React.FC<WorkHistoryProps> = ({ experiences }) => {
  return (
    <>
      <Card>
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Work History
          </h3>

          <PrimaryButton>Add Experience</PrimaryButton>
        </div>

        {experiences.map((experience) => (
          <div className="flex">
            <div className="mt-4">
              <Checkbox />
            </div>

            <div className="border sm:overflow-hidden sm:rounded-md">
              <div className="bg-white">
                <div className="grid grid-cols-3">
                  <div className="p-4 flex flex-col border-r">
                    <span className="font-medium text-gray-900">
                      {experience.companyName}
                    </span>
                    <span className="font-light text-gray-900">
                      {experience.jobTitle}
                    </span>
                  </div>

                  <div className="col-span-2 p-4 text-sm text-gray-500">
                    <ul className="list-disc list-inside">
                      {experience.bulletPoints.map((text) => (
                        <li className="truncate leading-6">{text}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Card>

      <form action="#" method="POST">
        <Card>
          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6 sm:col-span-3">
              <TextField name="company-name" label="Company name" />
            </div>

            <div className="col-span-6 sm:col-span-3">
              <WebsiteField name="company-website" label="Company website" />
            </div>

            <div className="col-span-6">
              <TextField name="job-title" label="Job title" />
            </div>

            <div className="col-span-6 sm:col-span-3">
              <MonthYearField label="Start" />
            </div>

            <div className="col-span-6 sm:col-span-3">
              <MonthYearField label="End" />
            </div>
          </div>
        </Card>
      </form>
    </>
  );
};

export default WorkHistory;
