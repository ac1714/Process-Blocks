export function SnippetPreview({ html, className }: { html: string; className?: string }) {
  return (
    <div
      className={"overflow-x-auto bg-white " + (className ?? "")}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
