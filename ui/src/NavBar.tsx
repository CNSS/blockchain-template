import { Link, useLocation } from 'react-router-dom';
import styles from './NavBar.module.scss';
import { className } from './utils';
import nes from './nes';

interface LinkMap {
    [key: string]: JSX.Element;
}

const allLinks: LinkMap = {
    '/': <Link key={0} to='/' className={className(styles.rightButton, nes.button)}><div>Chall Info</div></Link>,
    '/faucet': <Link key={1} to='/faucet' className={className(styles.rightButton, nes.button)}><div>Faucet</div></Link>,
    '/flag': <Link key={2} to='/flag' className={className(styles.rightButton, nes.button, nes.warning)}><div>Get Flag</div></Link>
};

const NavBar = () => {
    const location = useLocation();
    const currentPath = location.pathname as string;
    const links = [];

    for (const [path, link] of Object.entries(allLinks)) {
        if (path !== currentPath) {
            links.push(link);
        }
    }

    return (
        <div className={styles.nav}>
            <div className={styles.navElements}>
                <span>
                    <h1>
                        <i className={className("nes-icon", "is-medium", "coin", styles.title)}></i>
                        Bl0ckch@in W3b Serv1c3
                    </h1>
                </span>
                <div>
                    {links}
                </div>
            </div>
        </div>
    );
};

export { NavBar };