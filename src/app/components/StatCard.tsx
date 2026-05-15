interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  bgColor: string;
}

export default function StatCard({
  title,
  value,
  icon,
  bgColor,
}: StatCardProps) {
  return (
    <div
      className="
        bg-white 
        p-4 sm:p-5 lg:p-6
        rounded-2xl 
        shadow-sm 
        border border-gray-100
        flex items-center gap-3 sm:gap-4 lg:gap-5
        transition-all duration-300
        hover:shadow-lg hover:-translate-y-1
      "
    >
      <div
        className={`
          ${bgColor}
          p-3 sm:p-4
          rounded-xl
          flex items-center justify-center
          shrink-0
        `}
      >
        <div className="scale-90 sm:scale-100">
          {icon}
        </div>
      </div>

      <div className="min-w-0">
        <p
          className="
            text-gray-500
            text-[10px] sm:text-xs lg:text-sm
            font-semibold
            uppercase
            tracking-wider
            truncate
          "
        >
          {title}
        </p>

        <h3
          className="
            text-2xl sm:text-3xl
            font-bold
            text-gray-900
            break-words
          "
        >
          {value}
        </h3>
      </div>
    </div>
  );
}