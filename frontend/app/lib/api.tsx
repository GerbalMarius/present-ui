import axios, { AxiosResponse } from "axios"
import { getErrorMessagesFromError } from "./api-error";
import { CurrentUserReservations, DeskData, ReservationData, UserData } from "./types";

const BACKEND_URL: string = process.env.PUBLIC_API_URL || "https://localhost:7181/api";

export const api = axios.create({
    baseURL: BACKEND_URL,
    withCredentials: true
});

export type ApiError = {
    err: Error;
    messages: string[];
}

api.interceptors.response.use(
    (res) => res,
    (err) => {
        const messages: string[] = getErrorMessagesFromError(err);

        const ex: Error = new Error(messages[0]);

        const apiErr: ApiError = {
            err: ex,
            messages: messages
        };

        return Promise.reject(apiErr);
    }
)

export const backend = {
    async getDesks() : Promise<DeskData[]> {
        const res: AxiosResponse<DeskData[], any, {}> = await api.get<DeskData[]>("/desks");
        return res.data;
    },

    async getMe() : Promise<UserData> {
        const res: AxiosResponse<UserData, any, {} > =  await api.get<UserData>("/users/me");
        return res.data;
    },

    async createReservation(body : ReservationData) : Promise<ReservationData> {
        const res: AxiosResponse<ReservationData, any, {} > = await api.post<ReservationData>("/reservations", body);
        return res.data;
    },

    async getMeReservations() : Promise<CurrentUserReservations> {
        const res : AxiosResponse<CurrentUserReservations, any, {}> = await api.get<CurrentUserReservations>("/users/me/reservations");
        return res.data;
    },

    async cancelReservationDay(id : number) : Promise<void> {
        await api.patch(`/reservations/${id}/day`);
    },

    async cancelReservationWhole(id : number) : Promise<void> {
        await api.delete(`/reservations/${id}`);
    }
}

