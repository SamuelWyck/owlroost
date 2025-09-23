import "../styles/postsPage.css";
import { useOutletContext } from "react-router-dom";
import { useEffect } from "react";
import apiManager from "../utils/apiManager.js";



function PostsPage() {
    const headerRef = useOutletContext();


    useEffect(function() {
        apiManager.getPosts().then(function(res) {
            headerRef.current.updateUser(res.user);
        });
    }, [headerRef]);


    return (
        <p>hello world</p>
    );
};



export default PostsPage;