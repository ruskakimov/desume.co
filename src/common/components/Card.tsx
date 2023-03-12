import classNames from "classnames";

interface CardProps {
  children: React.ReactNode;
  sidePadding?: boolean;
}

const Card: React.FC<CardProps> = ({ sidePadding = true, children }) => {
  return (
    <div className="shadow bg-white sm:rounded-md">
      <div
        className={classNames("space-y-6 py-6", {
          "px-4 sm:px-6": sidePadding,
        })}
      >
        {children}
      </div>
    </div>
  );
};

export default Card;
