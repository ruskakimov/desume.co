import classNames from "classnames";

export default function Tabs() {
  return (
    <div className="flex bg-gray-2 relative after:block after:absolute after:bottom-0 after:w-full after:h-px after:bg-gray-3">
      <Tab selected text="Write" />
      <Tab text="Style" />
      <Tab text="Format" />
    </div>
  );
}

function Tab(props: { selected?: boolean; text: string }) {
  return (
    <div
      className={classNames(
        "py-3 px-4 text-sm font-bold hover:text-gray-5 select-none border-r border-gray-3",
        props.selected
          ? "bg-white text-gray-5 relative z-10"
          : "bg-gray-2 text-gray-4"
      )}
    >
      {props.text}
    </div>
  );
}
