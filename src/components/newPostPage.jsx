import "../styles/newPostPage.css";
import apiManager from "../utils/apiManager.js";
import { useOutletContext, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import PostForm from "./postForm.jsx";



function NewPostPage() {
    const navigate = useNavigate();
    const headerRef = useOutletContext();


    useEffect(function() {
        apiManager.checkAuthStatus().then(function(res) {
            if (res.errors) {
                return;
            }
            if (!res.authenticated) {
                return navigate("/", {replace: true});
            }

            headerRef.current.updateUser(res.user);
        });
    }, [])


    return (
        <main className="new-post-page">
            <PostForm edit={false} />
        </main>
    );
};



export default NewPostPage;