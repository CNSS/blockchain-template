import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Error } from './Error.tsx'
import { Home } from './Home.tsx';
import styles from './App.module.scss';
import { Faucet } from './Faucet.tsx';
import { Flag } from './Flag.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
    ErrorBoundary: Error
  },
  {
    path: "/faucet",
    Component: Faucet
  },
  {
    path: "/flag",
    Component: Flag
  }
]);


const App = () => (
  <div className={styles.appRoot}>
    <RouterProvider router={router} />
  </div>
);

export { App };
