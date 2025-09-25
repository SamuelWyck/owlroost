import "../styles/editPostPage.css";
import { useParams, useOutletContext } from "react-router-dom";
import PostForm from "./postForm.jsx";
import LoadingElement from "./loadingElement.jsx";
import { useState, useEffect } from "react";
import apiManager from "../utils/apiManager.js";



function EditPostPage() {
    const headerRef = useOutletContext();
    const {postId} = useParams();
    const [post, setPost] = useState(null);


    useEffect(function() {
        apiManager.getPostForEdit(postId).then(function(res) {
            if (res.errors) {
                return;
            }

            headerRef.current.updateUser(res.user);
            setPost(res.post);
        });
    }, [postId, headerRef]);


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