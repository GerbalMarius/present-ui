import { DeskStatus } from "./desk-status";


export type HoverInfo = {
    title : DeskStatus,
    body : string
}

const HOVER_INFO_TEXT: Record<DeskStatus, string> = {
  open: "Open for reservation. Click reserve to pick a date range.",
  reserved: "This desk is reserved.",
  maintenance: "This desk is currently under maintenance.",
};

export function cardClasses(status: DeskStatus): string {
  if (status === "open")
    return "border-emerald-200 bg-emerald-50/60 hover:shadow-emerald-200/30";

  if (status === "reserved")
    return "border-red-200 bg-red-50/70 hover:shadow-red-200/40";

  return "border-slate-200 bg-slate-50/70 hover:shadow-slate-200/40";
}

export function statusPillClasses(status: DeskStatus) : string {
  if (status === "open") return "border-emerald-300 text-emerald-700 bg-white/70";
  if (status === "reserved") return "border-red-300 text-red-700 bg-white/70";
  return "border-slate-300 text-slate-700 bg-white/70";
}



export function hoverInfo(status: DeskStatus, name: string | null): HoverInfo {
  if (status === "reserved" && name) {
    return { title: status, body: `Reserved by ${name}` };
  }
  return { title: status, body: HOVER_INFO_TEXT[status] };
}

export function pillAccent(status: DeskStatus) {
  if (status === "open") return "ring-emerald-200/70 shadow-emerald-200/30";
  if (status === "reserved") return "ring-red-200/70 shadow-red-200/30";
  return "ring-slate-200/70 shadow-slate-200/30";
}

export function formatDate(iso: string) : string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString();
}