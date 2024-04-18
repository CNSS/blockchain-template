import { Layout } from './Layout.tsx'
import { className, copyInputValue } from './utils.tsx';
import styles from './Home.module.scss';
import React from 'react';
import nes from './nes.tsx';

interface ContractProps {
    id: number;
    name: string;
    filename: string;
    address: string;
    downloadUrl: string;
}

const Contract = (props: ContractProps) => {
    const addressInputRef = React.createRef<HTMLInputElement>();
    return (
        <div className={className(nes.titledContainer, nes.centered, nes.rounded, styles.container)}>
            <b className={className(nes.title)}>
                <i className={className(nes.icon, nes.trophy, nes.small)}></i> Contract {props.id} <i className={className(nes.icon, nes.trophy, nes.small)}></i>
            </b>
            <div className={className(nes.field, styles.leftText)}>
                <label>Name</label>
                <input type="text" className={className(nes.input)} value={props.name} readOnly></input>
            </div>

            <br />

            <div className={className(nes.field, styles.leftText)}>
                <label>Filename</label>
                <div className={className(nes.field, nes.inline)}>
                    <input type="text" className={className(nes.input)} value={props.filename} readOnly></input>
                    <button className={className(nes.button, nes.primary, styles.inlineCopyBtnRight)} onClick={() => { window.open(props.downloadUrl, '_blank') }}>Down</button>
                </div>
            </div>

            <br />
            <div className={className(nes.field, styles.leftText)}>
                <label>Address</label>
                <div className={className(nes.field, nes.inline)}>
                    <input type="text" ref={addressInputRef} className={className(nes.input)} value={props.address} readOnly></input>
                    <button className={className(nes.button, nes.primary, styles.inlineCopyBtnRight)} onClick={() => { copyInputValue(addressInputRef) }}>Copy</button>
                </div>
            </div>
        </div>
    );
}

const Home = () => {
    const rpcRef = React.createRef<HTMLInputElement>();
    return (
        <Layout>
            <div className={className(nes.titledContainer, styles.container)}>
                <h3 className={className(nes.title)}>Challenge Description</h3>
                <div><span className={className(nes.text, nes.primary)}>This is a test challenge</span></div>
            </div>

            <div className={className(nes.titledContainer, styles.container)}>
                <h3 className={className(nes.text)}>Blockchain RPC Provider</h3>
                <div className={className(nes.field, nes.inline)}>
                    <input type="text" ref={rpcRef} className={className(nes.input)} value={`${window.location.protocol}//${window.location.host}/rpc`} readOnly={true}></input>
                    <button className={className(nes.button, nes.primary, styles.inlineCopyBtnRight)} onClick={() => { copyInputValue(rpcRef) }}>Copy</button>
                </div>
            </div>

            <div className={className(nes.titledContainer, styles.container)}>
                <h3 className={className(nes.title)}>Information of Contracts</h3>
                <Contract id={0} name="Challenge" filename="chall.sol" address="0xdeadbeef" downloadUrl="/download/Token.sol" />
                <br />
                <Contract id={1} name="Prover" filename="chall.sol" address="0x114514" downloadUrl="/download/Token.sol" />
            </div>

        </Layout >
    );
};

export { Home };