interface CardProps {
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children }) => {
  return (
    <div className="shadow sm:overflow-hidden sm:rounded-md">
      <div className="space-y-6 bg-white py-6 px-4 sm:p-6">{children}</div>
    </div>
  );
};

export default Card;
