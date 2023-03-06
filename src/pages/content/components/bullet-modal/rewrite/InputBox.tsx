import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import TextAreaField from "../../../../../common/components/fields/TextAreaField";
import { bulletMaxLength } from "../useBulletModal";

const InputBox: React.FC<{
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}> = (props) => {
  return (
    <div>
      <div className="relative">
        <TextAreaField
          label="Write a variation"
          rows={3}
          maxLength={bulletMaxLength}
          value={props.value}
          onChange={(e) => {
            props.onChange(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.code === "Enter") {
              e.preventDefault();
              props.onSubmit();
            }
          }}
          style={{ paddingRight: 52 }}
        />
        <button
          className="absolute top-6 right-0 p-2 m-2 rounded bg-gray-100"
          type="button"
          onClick={props.onSubmit}
        >
          <PaperAirplaneIcon className="h-5" />
        </button>
      </div>

      <div className="mt-2 flex justify-end text-sm text-gray-500">
        <span className="text-gray-900">
          {props.value.length}
          <span className="text-gray-500">/{bulletMaxLength}</span>
        </span>
      </div>
    </div>
  );
};

export default InputBox;
