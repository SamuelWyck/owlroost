import "../styles/postsPage.css";
import { useOutletContext } from "react-router-dom";
import { useEffect, useState, useRef, useContext } from "react";
import apiManager from "../utils/apiManager.js";
import PostCard from "./postCard.jsx";
import LoadingElement from "./loadingElement.jsx";
import { ErrorContext } from "../utils/context.js";



function PostsPage() {
    const errorRef = useContext(ErrorContext);
    const headerRef = useOutletContext();
    const [posts, setPosts] = useState(null);
    const orderByLikes = useRef(false);
    const pageNum = useRef(1);
    const morePosts = useRef(false);
    const fetchingPosts = useRef(false);


    useEffect(function() {
        const pageNum = 0;
        const orderByLikes = false;
        apiManager.getPosts(pageNum, orderByLikes)
        .then(function(res) {
            if (res.errors) {
                errorRef.current.showError("Server error");
                setPosts([]);
                return;
            }
            headerRef.current.updateUser(res.user);
            morePosts.current = res.morePosts;
            const userId = (res.user) ? res.user.id : null;
            setPosts(getPostCards(res.posts, userId));
        });
    }, [headerRef, errorRef]);


    async function handleScroll(event) {
        if (!morePosts.current || fetchingPosts.current) {
            return;
        }
        const target = event.target;
        const scrollLength = target.scrollTop + target.clientHeight;
        if (scrollLength !== event.target.scrollHeight) {
            return;
        }
        fetchingPosts.current = true;
        const res = await apiManager.getPosts(
            pageNum.current, orderByLikes.current
        );
        fetchingPosts.current = false;
        if (res.errors) {
            errorRef.current.showError("Server error");
            return;
        }

        pageNum.current += 1;
        morePosts.current = res.morePosts;
        headerRef.current.updateUser(res.user);
        setPosts(function(posts) {
            const userId = (res.user) ? res.user.id : null;
            const newPosts = getPostCards(
                res.posts, userId
            );
            return [...posts, newPosts];
        });
    };



    async function handleFilterChoice(orderViaLikes) {
        if (orderViaLikes === orderByLikes.current) {
            return;
        }

        pageNum.current = 0;
        orderByLikes.current = orderViaLikes;
        setPosts(null);
        const res = await apiManager.getPosts(
            pageNum.current, orderByLikes.current
        );
        if (res.errors) {
            errorRef.current.showError("Server error");
            setPosts([]);
            return;
        }

        pageNum.current += 1;
        headerRef.current.updateUser(res.user);
        morePosts.current = res.morePosts;
        const userId = (res.user) ? res.user.id : null;
        setPosts(getPostCards(res.posts, userId));
    };



    function getPostCards(posts, userId) {
        const cards = [];
        for (let post of posts) {
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


    if (!posts) {
        return (
        <main className="posts-page">
            <LoadingElement />
        </main>
        );
    }


    return (
    <main className="posts-page" onScroll={handleScroll}>
        <div className="filter-choices">
            <button 
                onClick={function() {
                    handleFilterChoice(false);
                }}
            >New</button>
            <button
                onClick={function() {
                    handleFilterChoice(true);
                }}
            >Popular</button>
        </div>
        <div className="posts">
            {posts}
        </div>
    </main>
    );
};



export default PostsPage;