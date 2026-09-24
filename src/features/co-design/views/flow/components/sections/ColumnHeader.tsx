// Ported from JT_dashboard/src/lib/Flow/components/sections/ColumnHeader.svelte.
// Only rendered for multi-column sections (none in the current store). The
// icon and hide toggle were commented out in the original.
import './ColumnHeader.css'

export default function ColumnHeader({ title }: { title: string }) {
  return (
    <span className="jtd-ColumnHeader question-header pointer-events-auto relative mb-1 inline-flex select-none items-center justify-center whitespace-nowrap rounded px-1 text-center text-[1rem] shadow-[0px_0px_1px_rgba(0,0,0,0.2)]">
      {title}
    </span>
  )
}
