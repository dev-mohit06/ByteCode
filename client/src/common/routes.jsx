import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import UserAuthForm from "../pages/userAuthForm.page";
import Editor from "../pages/editor.pages";
import { BlogProvider } from "./blog-context";
import HomePage from "../pages/home.page";
import SearchPage from "../pages/search.page";
import PageNotFound from "../pages/404.page";
import AnimationWrapper from "./page-animation";
import ProfilePage from '../pages/profile.page';
import BlogPage from '../pages/blog.page';

const routes = createBrowserRouter([
    {
        'path': '/',
        element: <App />,
        children: [
            {
                index: true,
                element: <HomePage />
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
                path: "/search/:query",
                element: <SearchPage />
            },
            {
                path: "/user/:id",
                element: <ProfilePage />
            },
            {
                path: "/blog/:blog_id",
                element: <BlogPage/>,
            }
        ],
    },
    {
        'path': "/editor",
        element: <BlogProvider>
            <Editor />
        </BlogProvider>
    },
    {
        'path': "/editor/:blog_id",
        element: <BlogProvider>
            <Editor />
        </BlogProvider>,
    },
    {
        path: "*",
        element: <AnimationWrapper><PageNotFound /></AnimationWrapper>
    }
]);

export default routes;