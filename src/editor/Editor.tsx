import logo from "../assets/text-logo.svg";
import PrimaryButton from "../common/components/PrimaryButton";
import ComponentBar from "./ComponentBar";
import DocumentGrid from "./DocumentGrid";

export default function Editor() {
  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden">
      <header className="h-12 shrink-0 bg-gray-1 border-b border-gray-3 flex justify-between items-center">
        <img className="h-full" src={logo} />
        <PrimaryButton>Export PDF</PrimaryButton>
      </header>
      <main className="grow min-h-0 flex flex-row">
        <section className="shrink-0 w-60 bg-gray-1 border-r border-gray-3">
          <ComponentBar />
        </section>
        <section className="grow overflow-auto bg-gray-2">
          <DocumentGrid />
        </section>
        <section className="shrink-0 w-80 bg-gray-1 border-l border-gray-3"></section>
      </main>
    </div>
  );
}