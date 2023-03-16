import { diffWords } from "diff";

export function buildRichDiff(
  oldText: string,
  newText: string
): [React.ReactElement, React.ReactElement] {
  const chunks = diffWords(oldText, newText);

  return [
    <>
      {chunks.map((chunk, i) => {
        if (chunk.added) return null;
        if (chunk.removed)
          return (
            <span key={i} className="bg-rose-100 rounded-sm">
              {chunk.value}
            </span>
          );
        return <span key={i}>{chunk.value}</span>;
      })}
    </>,
    <>
      {chunks.map((chunk, i) => {
        if (chunk.removed) return null;
        if (chunk.added)
          return (
            <span key={i} className="bg-emerald-100 rounded-sm">
              {chunk.value}
            </span>
          );
        return <span key={i}>{chunk.value}</span>;
      })}
    </>,
  ];
}
