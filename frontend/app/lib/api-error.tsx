import axios, { AxiosError } from "axios";

export type BackendErrorShape = {
    message?: string;

    title?: string;
    detail?: string;
    status?: number;
    instance?: string;
    type?: string;

    errors?: Record<string, string[] | string>;

    [key: string]: unknown;
};

function extractErrorMessages(data: BackendErrorShape | undefined): string[] {
    if (!data) return ["Something went wrong. Please try again."];

    const messages: string[] = [];

    if (typeof data.message === "string" && data.message.trim()) {
        messages.push(data.message.trim());
    }

    // ASP.NET ProblemDetails fields
    if (typeof data.detail === "string" && data.detail.trim()) {
        messages.push(data.detail.trim());
    }
    if (typeof data.title === "string" && data.title.trim()) {
        if (!messages.includes(data.title.trim())) messages.push(data.title.trim());
    }

    handleValidationErrors(data, messages);

    if (messages.length === 0) {
        const fallback = Object.values(data).find((v) => typeof v === "string" && v.trim());
        if (typeof fallback === "string") messages.push(fallback.trim());
    }

    return messages.length > 0
        ? messages
        : ["Bad input data. Please check your fields."];
}


export function getErrorMessagesFromError(
    err: unknown,
    opts: {
        invalidCredentialsMessage?: string;
        forbiddenMessage?: string;
        notFoundMessage?: string;
        defaultMessage?: string;
    } = {}
): string[] {
    const {
        invalidCredentialsMessage = "Bad credentials.",
        forbiddenMessage = "You don't have permission to do that.",
        notFoundMessage = "Not found.",
        defaultMessage = "Something went wrong. Please try again.",
    } = opts;

    if (axios.isAxiosError(err)) {
        const axiosErr = err as AxiosError<BackendErrorShape>;
        const status = axiosErr.response?.status;
        const data = axiosErr.response?.data;

        if (status === 401) return [invalidCredentialsMessage];
        if (status === 403) return [forbiddenMessage];
        if (status === 404) return [notFoundMessage];

        if (status === 422) return extractErrorMessages(data);

        const extracted = extractErrorMessages(data);
        return extracted.length ? extracted : [defaultMessage];
    }

    return ["Unexpected error. Please try again."];
}

export function getErrorMessage(err: unknown): string {
    return getErrorMessagesFromError(err)[0];
}

function handleValidationErrors(data: BackendErrorShape, messages: string[]): void {
    if (typeof data.errors !== "object") return;

    Object.values(data.errors).forEach((val) => {
        if (Array.isArray(val)) {
            val.forEach((msg) => {
                if (typeof msg === "string" && msg.trim()) messages.push(msg.trim());
            });
        } else if (typeof val === "string" && val.trim()) {
            messages.push(val.trim());
        }
    });

}