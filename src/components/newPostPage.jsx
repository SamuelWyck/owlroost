import "../styles/newPostPage.css";
import apiManager from "../utils/apiManager.js";
import { useOutletContext, useNavigate } from "react-router-dom";
import { useEffect, useContext } from "react";
import PostForm from "./postForm.jsx";
import { ErrorContext } from "../utils/context.js";



function NewPostPage() {
    const navigate = useNavigate();
    const errorRef = useContext(ErrorContext);
    const headerRef = useOutletContext();


    useEffect(function() {
        apiManager.checkAuthStatus().then(function(res) {
            if (res.errors) {
                errorRef.current.showError("Server error");
                return;
            }
            if (!res.authenticated) {
                return navigate("/", {replace: true});
            }

            headerRef.current.updateUser(res.user);
        });
    }, [headerRef, errorRef])


    return (
        <main className="new-post-page">
            <PostForm edit={false} />
        </main>
    );
};



export default NewPostPage;