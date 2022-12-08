import Card from "../../common/components/Card";
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
          <div className="border sm:overflow-hidden sm:rounded-md">
            <div className="space-y-6 bg-white py-6 px-4 sm:p-6">
              <span className="font-medium text-gray-900">
                {experience.companyName}
              </span>
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
