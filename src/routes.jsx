import App from "./App.jsx";
import AuthPage from "./components/authPage.jsx";
import NewPostPage from "./components/newPostPage.jsx";
import PostsPage from "./components/postsPage.jsx";



const routes = [
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                index: true,
                element: <PostsPage />
            },
            {
                path: "/posts/new",
                element: <NewPostPage />
            }
        ]
    },
    {
        path: "/signup",
        element: <AuthPage signup={true} />
    },
    {
        path: "/login",
        element: <AuthPage signup={false} />
    }
];



export default routes;