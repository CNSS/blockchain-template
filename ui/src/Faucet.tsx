import { Layout } from './Layout.tsx';
import { className } from './utils.tsx';
import styles from './Faucet.module.scss';
import nes from './nes.tsx';

const Faucet = () => {
    return (
        <Layout>
            <div className={className(nes.titledContainer, styles.container)}>
                <h3 className={className(nes.title)}>Faucet Rule</h3>
                <div><span className={className(nes.text, nes.primary)}>Test Rule</span></div>
            </div>

            <div className={className(nes.titledContainer, styles.container)}>
                <h3 className={className(nes.title)}>Faucet</h3>
                <div className={className(nes.field)}>
                    <label>Address</label>
                    <input type="text" className={className(nes.input)} placeholder="0xdeadbeef1145"></input>
                </div>
                <button type="submit" className={className(nes.button, nes.primary, styles.fundButton)}>Fund</button>
                <div className={styles.fundResult}></div>
            </div>
        </Layout>
    );
};

export { Faucet };