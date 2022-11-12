import classNames from "classnames";

export default function Tabs() {
  return (
    <div className="w-64 flex flex-col bg-gray-2 relative after:block after:absolute after:right-0 after:h-full after:w-px after:bg-gray-3">
      <Tab selected text="Personal Information" />
      <Tab text="Work Experience" />
      <Tab text="Education" />
      <Tab text="Projects" />
      <Tab text="Skills" />
    </div>
  );
}

function Tab(props: { selected?: boolean; text: string }) {
  return (
    <div
      className={classNames(
        "py-3 px-4 text-sm font-bold hover:text-gray-5 select-none border-b border-gray-3",
        props.selected
          ? "bg-gray-1 text-gray-5 relative z-10"
          : "bg-gray-2 text-gray-4"
      )}
    >
      {props.text}
    </div>
  );
}
