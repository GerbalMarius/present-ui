"use client";

import { useMemo, useState } from "react";
import { DeskStatus, fullUserName, getDeskStatus, reservedByMe } from "../lib/desk-status";
import { DeskData, UserData } from "../lib/types";
import { ApiError, backend } from "../lib/api";
import DateRangePicker from "./DateRangePicker";
import { useToast } from "../lib/toast-context";
import { cardClasses, formatDate, hoverInfo, pillAccent, statusPillClasses } from "../lib/card-utils";


export default function DeskCard({
  desk,
  me,
  onChanged,
}: {
  desk: DeskData;
  me: UserData | null;
  onChanged?: () => Promise<void> | void;
}) {
  const status: DeskStatus =  getDeskStatus(desk)
  const name: string | null = fullUserName(desk);
  const isMine: boolean = reservedByMe(desk, me);

  const { showToast } = useToast();

  const [busy, setBusy] = useState(false);
  const [openPicker, setOpenPicker] = useState(false);
  const [range, setRange] = useState<[Date | null, Date | null]>([null, null]);

  const canConfirm = !!range[0] && !!range[1] && !busy;
  const info =  hoverInfo(status, name);

  const preview = desk.reservationPreview;

  async function reserve() {
    if (!me) return;
    if (!range[0] || !range[1]) return;

    setBusy(true);
    try {
      await backend.createReservation({
        userId: me.id,
        deskId: desk.id,
        reservedFrom: range[0].toISOString(),
        reservedTo: range[1].toISOString(),
      });

      showToast("Reservation placed successfully", "success");
      await onChanged?.();
      setOpenPicker(false);
      setRange([null, null]);
    } catch (e: any) {
      const apiErr = e as ApiError;
      const msg = apiErr?.messages?.[0] ?? apiErr?.err?.message ?? "Failed to reserve.";
      showToast(msg, "error");
    } finally {
      setBusy(false);
    }
  }

  async function cancelDay() {
    if (!preview) return;

    setBusy(true);
    try {
      await backend.cancelReservationDay(preview.id);
      showToast("Cancelled reservation for a day", "success");
      await onChanged?.();
    } catch (e: any) {
      const apiErr = e as ApiError;
      const msg = apiErr?.messages?.[0] ?? apiErr?.err?.message ?? "Failed to cancel.";
      showToast(msg, "error");
    } finally {
      setBusy(false);
    }
  }

  async function cancelWhole() {
    if (!preview) return;

    setBusy(true);
    try {
      await backend.cancelReservationWhole(preview.id);
      showToast("Cancelled the reservation successfully", "success");
      await onChanged?.();
    } catch (e: any) {
      const apiErr = e as ApiError;
      const msg = apiErr?.messages?.[0] ?? apiErr?.err?.message ?? "Failed to cancel.";
      showToast(msg, "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className={[
        "group relative rounded-3xl border shadow-sm transition p-6",
        "hover:-translate-y-0.5 hover:shadow-xl",
        cardClasses(status),
      ].join(" ")}
    >
      <div
        className={[
          "pointer-events-none absolute z-20",
          "left-1/2 -translate-x-1/2 -top-14",
          openPicker ? "hidden" : "hidden group-hover:block",
        ].join(" ")}
      >
        <div className="relative w-80 rounded-2xl bg-white/95 backdrop-blur border border-red-100 shadow-2xl p-4">
          <div className="flex items-center justify-between">
            <div className="text-xs font-extrabold tracking-wide text-slate-900 uppercase">
              {info.title}
            </div>

            {status === "reserved" && isMine && (
              <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-red-100 text-red-800 border border-red-200">
                Yours
              </span>
            )}
          </div>

          <div className="mt-2 text-sm font-semibold text-slate-700 leading-snug">
            {info.body}
          </div>

          {status === "reserved" && preview && (
            <div className="mt-3 rounded-xl border border-red-100 bg-red-50/40 px-3 py-2">
              <div className="text-[11px] font-extrabold uppercase tracking-wide text-slate-700">
                Reserved dates
              </div>
              <div className="mt-1 text-sm font-black text-slate-900">
                {formatDate(preview.reservedFrom)} - {formatDate(preview.reservedTo)}
              </div>
            </div>
          )}

          <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 h-4 w-4 rotate-45 bg-white/95 border-b border-r border-red-100" />
        </div>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-semibold tracking-wide uppercase text-slate-600">
            Desk
          </div>
          <div className="mt-1 text-3xl md:text-4xl font-black tracking-tight text-slate-900">
            {desk.id}
          </div>
        </div>

        <span
          className={[
            "text-sm font-extrabold px-4 py-1.5 rounded-full border",
            "ring-2 ring-inset shadow-sm",
            pillAccent(status),
            statusPillClasses(status),
          ].join(" ")}
        >
          {status}
        </span>
      </div>

  

      {/* Actions */}
      <div className="mt-6">
        {status === "open" && (
          <div className="flex flex-col gap-3">
            {!openPicker ? (
              <button
                onClick={() => setOpenPicker(true)}
                className="inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-extrabold
                  bg-red-700 text-white shadow-lg hover:bg-red-600 transition"
              >
                Reserve
              </button>
            ) : (
              <div className="grid gap-3">
                <DateRangePicker value={range} onChange={setRange} disabled={busy} />

                <button
                  onClick={reserve}
                  disabled={!canConfirm}
                  className={`inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-extrabold
                    bg-red-700 text-white shadow-lg hover:bg-red-600 transition disabled:opacity-60
                    ${canConfirm ? "cursor-pointer" : "cursor-not-allowed"}`}
                >
                  {busy ? "Reserving..." : "Confirm reservation"}
                </button>

                <button
                  onClick={() => {
                    setOpenPicker(false);
                    setRange([null, null]);
                  }}
                  disabled={busy}
                  className="rounded-2xl px-4 py-2.5 text-sm font-bold bg-white/80 border border-red-200 
                            hover:bg-red-50 transition disabled:opacity-60"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}

        {status === "reserved" && isMine && preview && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={cancelDay}
              disabled={busy}
              className="rounded-2xl px-4 py-2.5 text-sm font-bold bg-white/80 border border-red-200 hover:bg-red-50 transition disabled:opacity-60"
            >
              Cancel day
            </button>

            <button
              onClick={cancelWhole}
              className="rounded-2xl px-4 py-2.5 text-sm font-bold bg-white/80 border border-red-200 hover:bg-red-50 transition"
            >
              Cancel range
            </button>
          </div>
        )}
      </div>
    </div>
  );
}