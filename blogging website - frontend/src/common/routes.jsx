import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import UserAuthForm from "../pages/userAuthForm.page";

const routes = createBrowserRouter([
    {
        'path': '/',
        element: <App />,
        children: [
            {
                index: true,
                element: <>Home Page</>
            },
            {
                path: "/signin",
                element: <UserAuthForm type={"sign-in"} />
            },
            {
                path: "/signup",
                element: <UserAuthForm type={"sign-up"} />
            },
            {
                path: "/editor",
                element: <>Blog write page</>
            },
        ],
    }
]);

export default routes;