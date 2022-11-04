import "./App.css";
import DocumentGrid from "./DocumentGrid";

function App() {
  return (
    <div className="h-screen w-screen flex flex-col">
      <header className="h-12 bg-gray-1 border-b border-gray-3"></header>
      <main className="grow flex flex-row">
        <section className="shrink-0 w-40 bg-gray-1 border-r border-gray-3"></section>
        <section className="grow overflow-auto bg-gray-2">
          <DocumentGrid />
        </section>
        <section className="shrink-0 w-80 bg-gray-1 border-l border-gray-3"></section>
      </main>
    </div>
  );
}

export default App;
