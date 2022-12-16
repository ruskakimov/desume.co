export default function PageHeader(props: { title: string }) {
  return (
    <header className="sm:hidden px-4">
      <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
        {props.title}
      </h1>
    </header>
  );
}
