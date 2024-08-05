import { Layout } from './Layout.tsx'
import { className, copyInputValue } from './utils.tsx';
import styles from './Home.module.scss';
import React from 'react';
import nes from './nes.tsx';
import { useBox } from './BoxProvider.tsx';

interface ContractProps {
    id: number;
    name: string;
    filename: string;
    address: string;
    downloadUrl: string;
}

const Contract = (props: ContractProps) => {
    const contractNameID = React.useId();
    const contractFilenameID = React.useId();
    const contractAddressID = React.useId();
    const addressInputRef = React.createRef<HTMLInputElement>();
    return (
        <div className={className(nes.titledContainer, nes.centered, nes.rounded, styles.contractContainer)}>
            <b className={className(nes.title)}>
                <i className={className(nes.icon, nes.trophy, nes.small)}></i> Contract {props.id} <i className={className(nes.icon, nes.trophy, nes.small)}></i>
            </b>
            <div className={className(nes.field, styles.leftText)}>
                <label htmlFor={contractNameID}>Name</label>
                <input id={contractNameID} type="text" className={className(nes.input)} value={props.name} readOnly></input>
            </div>

            <br />

            <div className={className(nes.field, styles.leftText)}>
                <label htmlFor={contractFilenameID}>Filename</label>
                <div className={className(nes.field, nes.inline)}>
                    <input id={contractFilenameID} type="text" className={className(nes.input)} value={props.filename} readOnly></input>
                    <button className={className(nes.button, nes.primary, styles.inlineCopyBtnRight)} onClick={() => { window.open(props.downloadUrl, '_blank') }}>Down</button>
                </div>
            </div>

            <br />
            <div className={className(nes.field, styles.leftText)}>
                <label htmlFor={contractAddressID}>Address</label>
                <div className={className(nes.field, nes.inline)}>
                    <input id={contractAddressID} type="text" ref={addressInputRef} className={className(nes.input)} value={props.address} readOnly></input>
                    <button className={className(nes.button, nes.primary, styles.inlineCopyBtnRight)} onClick={() => { copyInputValue(addressInputRef) }}>Copy</button>
                </div>
            </div>
        </div>
    );
}

const Home = () => {
    const box = useBox();
    const rpcRef = React.createRef<HTMLInputElement>();

    let rpcUrl;
    if (!box.auth.username || !box.auth.password) {
        rpcUrl = `${window.location.protocol}//${window.location.host}/rpc`;
    } else {
        rpcUrl = `${window.location.protocol}//${box.auth.username}:${box.auth.password}@${window.location.host}/rpc`;
    }

    return (
        <Layout>
            <div className={className(nes.titledContainer, styles.container)}>
                <h3 className={className(nes.title)}>Challenge Description</h3>
                <div><span className={className(nes.text, nes.primary)}>{box.description}</span></div>
            </div>

            <div className={className(nes.titledContainer, styles.container)}>
                <h3 className={className(nes.text)}>Blockchain RPC Provider</h3>
                <div className={className(nes.field, nes.inline)}>
                    <input type="text" ref={rpcRef} className={className(nes.input)} value={rpcUrl} readOnly={true}></input>
                    <button className={className(nes.button, nes.primary, styles.inlineCopyBtnRight)} onClick={() => { copyInputValue(rpcRef) }}>Copy</button>
                </div>
            </div>

            <div className={className(nes.titledContainer, styles.container)}>
                <h3 className={className(nes.title)}>Information of Contracts</h3>
                {
                    box.contracts.map((contract, idx) => {
                        return (
                            <Contract key={idx} id={idx} name={contract.name} filename={contract.filename} address={contract.address} downloadUrl={`/download?hash=${contract.hash}`} />
                        );
                    })
                }
            </div>

        </Layout >
    );
};

export { Home };