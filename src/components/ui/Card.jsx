export default function Card({ title, value, subtitle }) {
  return (
    <div className="card p-4">
      <div className="text-sm text-zinc-500">{title}</div>
      <div className="text-2xl font-semibold">{value}</div>
      {subtitle && <div className="text-xs text-zinc-400 mt-1">{subtitle}</div>}
    </div>
  )
}