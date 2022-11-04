interface PrimaryButtonProps {
  children: React.ReactNode;
}

export default function PrimaryButton({ children }: PrimaryButtonProps) {
  return (
    <button className="h-9 mx-4 px-3 bg-blue text-white text-sm font-body font-medium rounded">
      {children}
    </button>
  );
}
