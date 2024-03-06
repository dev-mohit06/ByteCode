import { Outlet } from "react-router-dom";
import Navbar from "./components/navbar.component";
import {UserProvider} from './common/context';

const App = () => {
    return (
        <UserProvider>
            <Navbar />
            <Outlet />
        </UserProvider>
    )
}

export default App;