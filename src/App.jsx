import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import ItemsPage from './pages/ItemsPage'
import MovementsPage from './pages/MovementsPage'
import LocationsPage from './pages/LocationsPage'
import SuppliersPage from './pages/SuppliersPage'
import SettingsPage from './pages/SettingsPage'
import Sidebar from './components/layout/Sidebar'
import Topbar from './components/layout/Topbar'


export default function App() {
return (
<div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
<div className="flex">
<Sidebar />
<main className="flex-1">
<Topbar />
<div className="p-4 md:p-6 lg:p-8">
<Routes>
<Route path="/" element={<Dashboard />} />
<Route path="/items" element={<ItemsPage />} />
<Route path="/movements" element={<MovementsPage />} />
<Route path="/locations" element={<LocationsPage />} />
<Route path="/suppliers" element={<SuppliersPage />} />
<Route path="/settings" element={<SettingsPage />} />
<Route path="*" element={<Navigate to="/" replace />} />
</Routes>
</div>
</main>
</div>
</div>
)
}