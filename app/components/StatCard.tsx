interface StatCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    bgColor: string;
}

export default function StatCard({ title, value, icon, bgColor }: StatCardProps) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-5">
            <div className={`p-4 rounded-lg ${bgColor}`}>
                {icon}
            </div>
            <div>
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">{title}</p>
                <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
            </div>
        </div>
    );
}