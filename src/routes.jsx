import App from "./App.jsx";
import AuthPage from "./components/authPage.jsx";
import NewPostPage from "./components/newPostPage.jsx";
import EditPostPage from "./components/editPostPage.jsx";
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
                path: "/hoots/new",
                element: <NewPostPage />
            },
            {
                path: "/hoots/:postId/edit",
                element: <EditPostPage />
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