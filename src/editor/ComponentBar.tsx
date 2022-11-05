import ComponentCard from "./ComponentCard";

export default function ComponentBar() {
  return (
    <div className="p-4">
      <ComponentCard name="Heading" />
      <ComponentCard name="Paragraph" />
      <ComponentCard name="Block" />
    </div>
  );
}
