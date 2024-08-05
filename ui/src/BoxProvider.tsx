import React from 'react';
import { api } from './utils';

interface Props {
    children: React.ReactNode;
}

interface Amount {
    amount: string;
    unit: string;
}

interface FaucetConfig {
    enabled: boolean;
    amount: string;
    unit: string;
    limit: Amount;
}

interface ContractInfo {
    address: string;
    name: string;
    filename: string;
    hash: string;
    showFile: boolean;
}

interface BasicAuthCredential {
    username: string | null;
    password: string | null;
}

interface Box {
    description: string,
    faucet: FaucetConfig,
    contracts: ContractInfo[]
    auth: BasicAuthCredential
}

const BoxContext = React.createContext<{ box: Box | undefined, loadingBox: boolean } | undefined>(undefined);

const BoxProvider = (props: Props) => {
    const [box, setBox] = React.useState<Box | undefined>(undefined);
    const [loadingBox, setLoadingBox] = React.useState(false);

    React.useEffect(() => {
        if (box === undefined) {
            setLoadingBox(true);
            api<Box>("GET", "box")
                .then((box) => {
                    setBox(box);
                    setLoadingBox(false);
                })
                .catch(() => {
                    setBox(undefined);
                    setLoadingBox(false);
                });
        }
    }, []);

    if (loadingBox) {
        return <div>Loading...</div>;
    }
    if (box === undefined) {
        return <div>Failed to load box</div>;
    }

    return (
        <BoxContext.Provider value={{ box, loadingBox }}>
            {props.children}
        </BoxContext.Provider>
    );
};

const useBox = (): Box => {
    const ctx = React.useContext(BoxContext);

    if (ctx === undefined) {
        throw new Error("useBox must be used within a BoxProvider");
    }

    if (ctx.box === undefined) {
        throw new Error("Box not loaded");
    }

    return ctx.box;
}

export type { Box, FaucetConfig, ContractInfo };
export { BoxProvider, useBox };
