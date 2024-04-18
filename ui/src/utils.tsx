import { RefObject } from "react";

const copyInputValue = (input: RefObject<HTMLInputElement>) => {
    input.current?.select();
    navigator.clipboard.writeText(input.current?.value || "");
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
        throw new Error((await response.text()) || response.statusText);
    }

    return response.json() as T;
}

export { copyInputValue, attr, className, api };