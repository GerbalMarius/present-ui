import { formatDate } from "../lib/card-utils";
import { ReservationData } from "../lib/types";

const ReservationTable = ({
  title,
  rows,
  emptyText,
}: {
  title: string;
  rows: ReservationData[];
  emptyText: string;
}) =>  {
  return (
    <div className="rounded-3xl bg-white/80 backdrop-blur border border-red-100 shadow-lg overflow-hidden">
      <div className="px-5 py-4 border-b border-red-100 flex items-center justify-between">
        <h2 className="text-lg font-extrabold tracking-tight text-slate-900">
          {title}
        </h2>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-800">
          {rows.length}
        </span>
      </div>

      {rows.length === 0 ? (
        <div className="px-5 py-6 text-sm font-semibold text-slate-600">
          {emptyText}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-red-50/70 text-slate-700">
              <tr>
                <th className="px-5 py-3 text-left font-extrabold">Desk</th>
                <th className="px-5 py-3 text-left font-extrabold">From</th>
                <th className="px-5 py-3 text-left font-extrabold">To</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, idx) => (
                <tr
                  key={`${r.deskId}-${r.reservedFrom}-${idx}`}
                  className="border-t border-red-100/60 hover:bg-red-50/40 transition"
                >
                  <td className="px-5 py-3 font-extrabold text-slate-900">
                    {`#${r.deskId}`}
                  </td>
                  <td className="px-5 py-3 font-semibold text-slate-700">
                    {formatDate(r.reservedFrom)}
                  </td>
                  <td className="px-5 py-3 font-semibold text-slate-700">
                    {formatDate(r.reservedTo)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ReservationTable;