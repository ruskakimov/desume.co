interface ComponentCardProps {
  name: string;
}

export default function ComponentCard({ name }: ComponentCardProps) {
  return (
    <div className="h-9 mb-4 border border-gray-3 rounded flex items-center text-sm text-gray-5 select-none hover:shadow-lg transition cursor-grab">
      <div className="h-5 w-5 mx-2 bg-gray-2 rounded-sm"></div>
      {name}
    </div>
  );
}
