import React, { useState } from "react";
import MonthYearField from "../../common/components/fields/MonthYearField";
import TextField from "../../common/components/fields/TextField";
import WebsiteField from "../../common/components/fields/WebsiteField";
import SlideOver from "../../common/components/SlideOver";

export default function useAddExperiencePanel(): [() => void, React.ReactNode] {
  const [open, setOpen] = useState(false);

  const openPanel = () => {
    setOpen(true);
  };

  return [
    openPanel,
    <SlideOver
      isOpen={open}
      title="Add Experience"
      onClose={() => setOpen(false)}
      onSubmit={() => console.log("save work")}
    >
      <form action="#" method="POST">
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
      </form>
    </SlideOver>,
  ];
}
