import "../styles/editPostPage.css";
import { useParams, useOutletContext } from "react-router-dom";
import PostForm from "./postForm.jsx";
import LoadingElement from "./loadingElement.jsx";
import { useState, useEffect, useContext } from "react";
import apiManager from "../utils/apiManager.js";
import { ErrorContext } from "../utils/context.js";



function EditPostPage() {
    const errorRef = useContext(ErrorContext);
    const headerRef = useOutletContext();
    const {postId} = useParams();
    const [post, setPost] = useState(null);


    useEffect(function() {
        apiManager.getPost(postId).then(function(res) {
            if (res.errors) {
                errorRef.current.showError("Server error");
                setPost({});
                return;
            }

            headerRef.current.updateUser(res.user);
            setPost(res.post);
        });
    }, [postId, headerRef, errorRef]);


    if (!post) {
        return (
        <main className="edit-post-page">
            <LoadingElement />
        </main> 
        );
    }


    return (
    <main className="edit-post-page">
        <PostForm 
            edit={true} 
            titleValue={post.title} 
            contentValue={post.content}
            postId={postId}
        />
    </main>
    );
};



export default EditPostPage;