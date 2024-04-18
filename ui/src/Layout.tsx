import { Footer } from './Footer';
import { NavBar } from './NavBar';
import styles from './Layout.module.scss';

interface Props {
    children: React.ReactNode;
}


const Layout = (props: Props) => {
    return (
        <>
            <NavBar />
            <div className={styles.mainContainer}>
                {props.children}
            </div>
            <Footer />
        </>
    );
};

export { Layout };