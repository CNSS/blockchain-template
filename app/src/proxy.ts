import { Response, Request } from 'express';
import { env } from 'process';

const methodWhiteList = [
    "eth_blockNumber",
    "eth_call",
    "eth_chainId",
    "eth_estimateGas",
    "eth_feeHistory",
    "eth_gasPrice",
    "eth_getBalance",
    "eth_getBlockByHash",
    "eth_getBlockByNumber",
    "eth_getCode",
    "eth_getStorageAt",
    "eth_getTransactionByHash",
    "eth_getTransactionCount",
    "eth_getTransactionReceipt",
    "eth_sendRawTransaction",
    "net_version",
    "rpc_modules",
    "web3_clientVersion",
];

interface JSONRPCBody {
    jsonrpc: "2.0";
    method: string;
    params: any[] | object | null;
    id: number | null;
}

enum JSONRPCErrorCode {
    PARSE_ERROR = -32700,
    INVALID_REQUEST = -32600,
    METHOD_NOT_FOUND = -32601,
    INVALID_PARAMS = -32602,
    INTERNAL_ERROR = -32603,
    INVALID_INPUT = -32000,
    RESOURCE_NOT_FOUND = -32001,
    RESOURCE_UNAVAILABLE = -32002,
    TRANSACTION_REJECTED = -32003,
    METHOD_NOT_SUPPORTED = -32004,
    LIMIT_EXCEEDED = -32005,
    JSONRPC_VERSION_UNSUPPORTED = -32006,
}


const createErrorResponse = (code: Number, message: String, id: Number | null) => {
    return {
        jsonrpc: "2.0",
        error: {
            code,
            message,
        },
        id,
    };
}

const proxy = (body: JSONRPCBody, res: Response) => {
    let providerUrl = env.PROVIDER_URL ?? "http://127.0.0.1:58545/";

    fetch(providerUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(30000)
    })
        .then((response) => {
            return response.json();
        })
        .then((response) => {
            if (
                body.method === "eth_getBlockByHash" ||
                body.method === "eth_getBlockByNumber"
            ) {
                if (response.result) {
                    response.result.transactions = [];
                }
            }

            res.status(200).json(response);
        })
        .catch((error) => {
            res.status(500).json(createErrorResponse(JSONRPCErrorCode.INTERNAL_ERROR, "Internal error", body.id));
        });
}

export const proxyHandler = async (req: Request<any, any, Buffer>, res: Response) => {
    let body: JSONRPCBody;

    try {
        body = JSON.parse(req.body.toString());
    } catch (err) {
        res.status(415).json(createErrorResponse(JSONRPCErrorCode.PARSE_ERROR, "Parse error", null));
        return;
    }

    if (body.jsonrpc !== "2.0") {
        res.status(400).json(createErrorResponse(JSONRPCErrorCode.JSONRPC_VERSION_UNSUPPORTED, "JSON-RPC version unsupported", body.id));
        return;
    }

    if (!body.method) {
        res.status(400).json(createErrorResponse(JSONRPCErrorCode.INVALID_REQUEST, "Invalid Request", body.id));
        return;
    }

    if (!methodWhiteList.includes(body.method)) {
        res.status(400).json(createErrorResponse(JSONRPCErrorCode.METHOD_NOT_SUPPORTED, "Method not supported", body.id));
        return;
    }

    proxy(body, res);
}