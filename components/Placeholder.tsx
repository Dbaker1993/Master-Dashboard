interface PlaceholderProps {
  title: string;
  description: string;
  icon: string;
}

export default function Placeholder({ title, description, icon }: PlaceholderProps) {
  return (
    <div className="card border-2 border-dashed border-slate-600 flex flex-col items-center justify-center py-12 text-center">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className="text-slate-400 max-w-md">{description}</p>
      <div className="mt-6 px-4 py-2 bg-slate-800 rounded text-sm text-slate-300">
        🔌 API Integration Ready
      </div>
    </div>
  );
}
