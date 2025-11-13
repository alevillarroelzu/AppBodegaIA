export default function Topbar() {
return (
<header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-zinc-950/60 border-b border-zinc-200 dark:border-zinc-800">
<div className="flex items-center justify-between px-4 md:px-6 py-3">
<div className="md:hidden font-semibold">Inventario TI</div>
<div className="text-sm text-zinc-500">Vite + React + Tailwind</div>
</div>
</header>
)
}