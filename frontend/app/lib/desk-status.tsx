import { DeskData, UserData } from "./types";


export type DeskStatus = "open" | "reserved" | "maintenance";

export function getDeskStatus(desk : DeskData) : DeskStatus {
    if (desk.isInMaintenance) {
        return "maintenance";
    }
    if (desk.isReserved) {
        return "reserved";
    }
    return "open"; 
}

export function fullUserName(desk : DeskData) : string | null {
    if (!desk.reservedBy) {
        return null;
    }
    return `${desk.reservedBy.firstName} ${desk.reservedBy.lastName}`;
}

export function reservedByMe(desk : DeskData, me : UserData | null) : boolean {
    return !!me && !!desk.reservedBy && desk.reservedBy.id === me.id;
}