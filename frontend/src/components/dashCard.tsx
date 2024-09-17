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
    <div className="p-4 bg-white shadow-lg border rounded-md flex justify-between items-center w-[250px] h-[100px] relative">
      <div className="w-1/6">{icon}</div>
      <div className="w-5/6 flex flex-col items-end">
        <h2 className="text-lg font-semibold">{number}</h2>
        <p className="text-end">{title}</p>
      </div>
      <div className={`${color} w-1 h-full absolute right-0`} />
    </div>
  );
}
