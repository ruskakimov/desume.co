import logo from "../assets/text-logo.svg";
import PrimaryButton from "../common/components/PrimaryButton";
import { generatePdfFromHtml } from "../pdf/generatePdfFromHtml";
import ComponentBar from "./ComponentBar";
import DocumentArea from "./DocumentArea";

export default function Editor() {
  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden">
      <header className="h-12 shrink-0 bg-gray-1 border-b border-gray-3 flex justify-between items-center">
        <img className="h-full ml-2" src={logo} />
        <PrimaryButton
          onClick={() => {
            const page1 = document.getElementById("page-1");
            if (page1) {
              generatePdfFromHtml(page1).save();
            }
          }}
        >
          Export PDF
        </PrimaryButton>
      </header>
      <main className="grow min-h-0 flex flex-row">
        <section className="shrink-0 w-60 bg-gray-1 border-r border-gray-3">
          <ComponentBar />
        </section>
        <section className="grow bg-gray-2">
          <DocumentArea />
        </section>
        <section className="shrink-0 w-80 bg-gray-1 border-l border-gray-3"></section>
      </main>
    </div>
  );
}
