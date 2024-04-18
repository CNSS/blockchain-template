import { RefObject } from "react";

interface ApiErrorMessage {
    status: number;
    content: string | null;
}

class ApiError extends Error {

    public apiError: ApiErrorMessage;

    constructor(message: ApiErrorMessage) {
        super(`Api Error: ${message.status} - ${message.content}`);
        this.name = "ApiError";
        this.apiError = message;
    }
}

const copyInputValue = (input: RefObject<HTMLInputElement>) => {
    if (navigator.clipboard && window.isSecureContext) {
        input.current?.select();
        navigator.clipboard.writeText(input.current?.value || "");
    } else {
        input.current?.select();
        try{
            document.execCommand("copy");
        }catch(e){
            console.error("Copy failed", e);
        }
    }
}

const className = (...classes: string[]) => {
    return classes.join(' ');
}

const attr = (key: string, value: string) => {
    return { [key]: value };
}

const api = async <T,>(method: string, endpoint: string, body?: unknown): Promise<T> => {
    let request: RequestInit = { method };

    if (body !== undefined) {
        request = {
            ...request,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        };
    }

    const response = await fetch(`/api/${endpoint}`, request);

    if (!response.ok) {
        throw new ApiError({
            status: response.status,
            content: await response.text(),
        });
    }

    return response.json() as T;
}

export { copyInputValue, attr, className, api };
export type { ApiError, ApiErrorMessage };