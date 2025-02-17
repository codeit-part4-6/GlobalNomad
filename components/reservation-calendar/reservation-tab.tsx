export default function ReservationTab({label, count, isActive, onClick}: {label: string; count: number; isActive: boolean; onClick: () => void}) {
  return (
    <div
      onClick={onClick}
      className={`relative cursor-pointer pb-4 text-xl ${isActive ? 'border-b-2 border-green-100 font-semibold text-green-100' : 'text-gray-800'}`}
    >
      {label} {count}
    </div>
  );
}
