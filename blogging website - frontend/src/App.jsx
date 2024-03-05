import { Outlet } from "react-router-dom";
import Navbar from "./components/navbar.component";

const App = () => {
    return (
        <>
            <Navbar />
            <Outlet />
        </>
    )
}

export default App;