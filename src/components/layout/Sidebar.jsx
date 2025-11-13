import { NavLink } from 'react-router-dom'


const link =
'block rounded-xl px-3 py-2 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900'
const active = 'bg-zinc-200 dark:bg-zinc-800'


export default function Sidebar() {
return (
<aside className="hidden md:block w-64 border-r border-zinc-200 dark:border-zinc-800 p-4">
<h1 className="text-lg font-semibold mb-4">Inventario TI</h1>
<nav className="space-y-1">
<NavLink to="/" className={({ isActive }) => `${link} ${isActive ? active : ''}`} end>
Dashboard
</NavLink>
<NavLink to="/items" className={({ isActive }) => `${link} ${isActive ? active : ''}`}>
Ítems
</NavLink>
<NavLink to="/movements" className={({ isActive }) => `${link} ${isActive ? active : ''}`}>
Movimientos
</NavLink>
<NavLink to="/locations" className={({ isActive }) => `${link} ${isActive ? active : ''}`}>
Ubicaciones
</NavLink>
<NavLink to="/suppliers" className={({ isActive }) => `${link} ${isActive ? active : ''}`}>
Proveedores
</NavLink>
<NavLink to="/settings" className={({ isActive }) => `${link} ${isActive ? active : ''}`}>
Ajustes
</NavLink>
</nav>
</aside>
)
}