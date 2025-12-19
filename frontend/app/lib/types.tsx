export type UserData = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
};

export type ReservationPreview = {
  id: number;
  reservedFrom: string;
  reservedTo: string;
};

export type DeskData = {
  id: number;
  isReserved: boolean;
  isInMaintenance: boolean;
  reservedBy: UserData | null;
  reservationPreview: ReservationPreview | null;
}

export type ReservationData = {
    userId : number;
    deskId : number;
    reservedFrom : string;
    reservedTo : string;
}

export type CurrentUserReservations = {
      currentReservations : ReservationData[];
      pastReservations : ReservationData[];
}