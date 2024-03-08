import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import UserAuthForm from "../pages/userAuthForm.page";
import Editor from "../pages/editor.pages";
import { BlogProvider } from "./blog-context";

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
            }
        ],
    },
    {
        'path': "/editor",
        element: <BlogProvider>
            <Editor/>
        </BlogProvider>
    }
]);

export default routes;