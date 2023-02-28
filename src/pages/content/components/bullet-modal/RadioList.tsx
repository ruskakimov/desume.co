import { RadioGroup } from "@headlessui/react";
import classNames from "classnames";

interface RadioListProps {
  value: string;
  items: { value: string; text: string }[];
  onChange: (value: string) => void;
}

const RadioList: React.FC<RadioListProps> = ({ value, items, onChange }) => {
  return (
    <RadioGroup value={value} onChange={onChange}>
      <RadioGroup.Label className="sr-only"> Privacy setting </RadioGroup.Label>
      <div className="-space-y-px rounded-md bg-white">
        {items.map((item, index) => (
          <RadioGroup.Option
            key={item.value}
            value={item.value}
            className={({ checked }) =>
              classNames(
                index === 0 ? "rounded-tl-md rounded-tr-md" : "",
                index === items.length - 1 ? "rounded-bl-md rounded-br-md" : "",
                checked ? "bg-gray-50 border-gray-200 z-10" : "border-gray-200",
                "relative border p-4 flex cursor-pointer focus:outline-none"
              )
            }
          >
            {({ checked }) => (
              <>
                <span
                  className={classNames(
                    checked
                      ? "bg-gray-600 border-transparent"
                      : "bg-white border-gray-300",
                    "mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded-full border flex items-center justify-center"
                  )}
                  aria-hidden="true"
                >
                  <span className="rounded-full bg-white w-1.5 h-1.5" />
                </span>
                <span className="ml-3">
                  <RadioGroup.Label
                    as="span"
                    className="text-gray-900 block text-sm"
                  >
                    {item.text}
                  </RadioGroup.Label>
                </span>
              </>
            )}
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  );
};

export default RadioList;
