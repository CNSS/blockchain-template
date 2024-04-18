import { Layout } from './Layout.tsx';
import { api, className } from './utils.tsx';
import styles from './Faucet.module.scss';
import nes from './nes.tsx';
import React from 'react';
import { useBox } from './BoxProvider.tsx';

interface FundResponse {
    status: "ok" | "error";
    message: string;
}

interface FundResult {
    className: string;
    message: string;
}


const Faucet = () => {
    const box = useBox();
    const addressID = React.useId();
    const addressInputRef = React.createRef<HTMLInputElement>();
    const [result, setResult] = React.useState<FundResult | undefined>(undefined);

    const fundAddress = React.useCallback(async (address?: string) => {
        if (!address) {
            setResult({
                className: nes.error,
                message: "Invalid address"
            });
            return;
        }

        if (!/^0x[0-9a-fA-F]{40}$/.test(address)) {
            setResult({
                className: nes.error,
                message: "Invalid address"
            });
            return;
        }

        setResult({
            className: nes.warning,
            message: "Funding address..."
        })

        api<FundResponse>("POST", "faucet", { address })
            .then((response) => {
                setResult({
                    className: response.status === "ok" ? nes.success : nes.error,
                    message: response.message
                });
            })
            .catch((_) => {
                setResult({
                    className: nes.error,
                    message: "Internal error"
                });
            });
    }, []);

    return (
        <Layout>
            <div className={className(nes.titledContainer, styles.container)}>
                <h3 className={className(nes.title)}>Faucet Rule</h3>
                <div><span className={className(nes.text, nes.primary)}>
                    * {box.faucet.amount} {box.faucet.unit} per request <br />
                    * {box.faucet.limit.amount} {box.faucet.limit.unit} at maximum
                </span></div>
            </div>

            <div className={className(nes.titledContainer, styles.container)}>
                <h3 className={className(nes.title)}>Faucet</h3>
                <div className={className(nes.field)}>
                    <label htmlFor={addressID}>Address</label>
                    <input id={addressID} ref={addressInputRef} type="text" className={className(nes.input)} placeholder="0xdeadbeef1145"></input>
                </div>
                <button type="submit" className={className(nes.button, nes.primary, styles.fundButton)} onClick={() => { fundAddress(addressInputRef.current?.value) }}>Fund</button>
                <div className={styles.fundResult}>
                    {result && (
                        <h2 className={className(nes.text, result.className)}>{result.message}</h2>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export { Faucet };