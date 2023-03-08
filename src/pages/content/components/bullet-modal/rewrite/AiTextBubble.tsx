import { useEffect, useState } from "react";

const AiTextBubble: React.FC<{ text: string }> = (props) => {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    setDisplayed("");

    const intervalId = window.setInterval(() => {
      setDisplayed((displayed) => props.text.slice(0, displayed.length + 1));
    }, 20);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [props.text]);

  return (
    <div className="grid grid-cols-[auto_1fr] gap-2">
      <div className="h-8 w-8 flex justify-center items-center text-sm text-white font-bold tracking-wide bg-sky-500 rounded-full mt-2.5">
        AI
      </div>
      <p className="text-sm p-4 bg-sky-50 rounded-md text-sky-900 leading-normal whitespace-pre-wrap">
        {displayed.length > 0 ? displayed : <div className="h-5" />}
      </p>
    </div>
  );
};

export default AiTextBubble;
