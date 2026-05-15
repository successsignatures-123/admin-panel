import Link from 'next/link';
import { LayoutDashboard, Briefcase, FileText, Users, BookOpen } from 'lucide-react';

const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
    { name: 'Jobs', icon: Briefcase, href: '/jobs' },
    { name: 'Applications', icon: FileText, href: '/applications' },
    { name: 'Users', icon: Users, href: '/users' },
];

export default function Sidebar() {
    return (
        <aside className="w-64 h-screen bg-gray-900 text-white p-4 fixed">
            <h1 className="text-xl font-bold mb-10 text-center">Admin Panel</h1>
            <nav className="space-y-2">
                {menuItems.map((item) => (
                    <Link key={item.name} href={item.href} className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded-lg">
                        <item.icon size={20} />
                        {item.name}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}