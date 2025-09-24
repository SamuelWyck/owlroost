import "../styles/postsPage.css";
import { useOutletContext } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import apiManager from "../utils/apiManager.js";
import PostCard from "./postCard.jsx";
import {formatDate, formatNumber} from "../utils/formatters.js";
import LoadingElement from "./loadingElement.jsx";



function PostsPage() {
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
                return;
            }
            headerRef.current.updateUser(res.user);
            morePosts.current = res.morePosts;
            setPosts(getPostCards(res.posts, res.user.id));
        });
    }, [headerRef]);


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
            return;
        }

        pageNum.current += 1;
        morePosts.current = res.morePosts;
        headerRef.current.updateUser(res.user);
        setPosts(function(posts) {
            const newPosts = getPostCards(
                res.posts, res.user.id
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
            return;
        }

        pageNum.current += 1;
        headerRef.current.updateUser(res.user);
        morePosts.current = res.morePosts;
        setPosts(getPostCards(res.posts, res.user.id));
    };



    function getPostCards(posts, userId) {
        const cards = [];
        for (let post of posts) {
            post.date = formatDate(post.date);
            post.displayLikes = formatNumber(post.likes);
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