import styles from './Footer.module.scss';
import { className } from './utils.tsx';
import nes from './nes.tsx';

const Footer = () => {
    return (
        <footer className={className(styles.footer)}>
            <div className={className(styles.footerContent)}>
                <span className={className(nes.text, nes.disabled)}>
                    Copyright  2024-now @CNSS All Rights Reserved.
                </span>
            </div>
        </footer>
    );
};

export { Footer };