interface Props {
  pills: string[];
  activeFilter: string | null;
  setActiveFilter: (filter: string | null) => void;
}

export function FilterPills({ pills, activeFilter, setActiveFilter }: Props) {
  return (
    <div className="flex overflow-x-auto no-scrollbar gap-3 px-4 mb-4 snap-x snap-mandatory scroll-smooth">
      {pills.map((pill) => (
        <button
          key={pill}
          onClick={() => setActiveFilter(activeFilter === pill ? null : pill)}
          className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-colors border snap-center ${
            activeFilter === pill
              ? 'bg-white text-black border-white'
              : 'bg-white/10 hover:bg-white/20 text-white border-white/5'
          }`}
        >
          {pill}
        </button>
      ))}
    </div>
  );
}
