import "../styles/postsPage.css";
import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import apiManager from "../utils/apiManager.js";
import PostCard from "./postCard.jsx";
import {formatDate, formatNumber} from "../utils/formatters.js";



function PostsPage() {
    const headerRef = useOutletContext();
    const [posts, setPosts] = useState(null);


    useEffect(function() {
        apiManager.getPosts().then(function(res) {
            if (res.errors) {
                return;
            }

            headerRef.current.updateUser(res.user);
            setPosts(getPostCards(res.posts, res.user.id));
        });
    }, [headerRef]);


    function getPostCards(posts, userId) {
        const cards = [];
        for (let post of posts) {
            post.date = formatDate(post.date);
            post.displayLikes = formatNumber(post.likes);
            console.log(post)
            cards.push(
                <PostCard 
                    post={post} 
                    key={post.post_id} 
                    userId={userId} 
                />
            );
        }
        return cards;
    };


    return (
    <main className="posts-page">
        <div className="filter-choices">
            <button>New</button>
            <button>Popular</button>
        </div>
        <div className="posts">
            {posts}
        </div>
    </main>
    );
};



export default PostsPage;