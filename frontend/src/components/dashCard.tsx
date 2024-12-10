export default function DashCard({
  number,
  title,
  icon,
  color,
}: {
  number: number;
  title: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="px-4 overflow-hidden bg-white shadow-lg border rounded-md flex justify-between items-center w-[250px] h-[80px] relative">
      <div className="w-1/12">{icon}</div>
      <div className="w-5/6 flex flex-col items-end">
        <h2 className="text-base font-semibold">{number}</h2>
        <p className="text-end text-sm">{title}</p>
      </div>
      <div className={`${color} w-1 h-full absolute right-0`} />
    </div>
  );
}
