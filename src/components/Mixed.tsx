/** Renders text with Latin/number runs isolated as LTR so Arabic sentences with gym terms read correctly in RTL. */
export function Mixed({ children, className }: { children: string; className?: string }) {
  const parts = children.split(/([A-Za-z0-9][A-Za-z0-9 .×+\-–\/%°:@()]*[A-Za-z0-9%°)]|[A-Za-z0-9])/g).filter(Boolean)
  return (
    <span className={className}>
      {parts.map((p, i) => (/^[A-Za-z0-9]/.test(p) ? <bdi key={i} dir="ltr">{p}</bdi> : <span key={i}>{p}</span>))}
    </span>
  )
}
