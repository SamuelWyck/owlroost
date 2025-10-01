import "../styles/postPage.css";
import { useParams, useOutletContext } from "react-router-dom";
import { useEffect, useState, useRef, useContext } from "react";
import apiManager from "../utils/apiManager.js";
import {formatNumber, formatDate} from "../utils/formatters.js";
import LoadingElement from "./loadingElement.jsx";
import CommentForm from "./commentFrom.jsx";
import CommentCard from "./commentCard.jsx";
import defaultImg from "../assets/account.svg";
import featherImg from "../assets/feather.svg";
import { ErrorContext } from "../utils/context.js";



function PostPage() {
    const {postId} = useParams();
    const errorRef = useContext(ErrorContext);
    const headerRef = useOutletContext();
    const sentLike = useRef(false);
    const pageNum = useRef(1);
    const moreComments = useRef(false);
    const fetchingComments = useRef(false);
    const [post, setPost] = useState(null);
    const [likesInfo, setLikesInfo] = useState(null);
    const [comments, setComments] = useState(null);
    const [user, setUser] = useState(null);


    useEffect(function() {
        Promise.all([
            apiManager.getPost(postId),
            apiManager.getPostComments(postId, 0)
        ]).then(function(res) {
            const [postRes, commentsRes] = res;
            if (postRes.errors || commentsRes.errors) {
                errorRef.current.showError("Server error");
                setPost({});
                setLikesInfo({});
                setComments([]);
                return;
            }

            headerRef.current.updateUser(postRes.user);
            moreComments.current = commentsRes.moreComments;
            const likesInfo = {};
            likesInfo.display = formatNumber(postRes.post.likes);
            likesInfo.likes = Number(postRes.post.likes);
            likesInfo.likedPost = postRes.userLikedPost;
            postRes.post.date = formatDate(
                postRes.post.timestamp
            );

            setLikesInfo(likesInfo);
            setPost(postRes.post);
            const userId = (postRes.user) ? 
            postRes.user.id : null;
            setComments(
                getCommentCards(commentsRes.comments, userId)
            );
            if (postRes.user) {
                setUser(postRes.user);
            }
        })
    }, [postId, headerRef, errorRef]);


    function getCommentCards(comments, userId) {
        const cards = [];
        for (let comment of comments) {
            cards.push(
                <CommentCard 
                    comment={comment}
                    key={comment.id}
                    userId={userId}
                />
            );
        }
        return cards;
    };


    async function toggleLike() {
        if (!user || sentLike.current) {
            return;
        }

        sentLike.current = true;
        const res = await apiManager.togglePostLike(postId);
        sentLike.current = false;
        if (res.errors) {
            errorRef.current.showError("Server error");
            return;
        }

        if (likesInfo.likedPost) {
            likesInfo.likedPost = false;
            likesInfo.likes -= 1;
            likesInfo.display = formatNumber(likesInfo.likes);
        } else {
            likesInfo.likedPost = true;
            likesInfo.likes += 1;
            likesInfo.display = formatNumber(likesInfo.likes);
        }
        setLikesInfo({...likesInfo});
    };


    function newCommentCb(comment) {
        const userId = (user) ? user.id : null;
        const card = <CommentCard
            key={comment.id}
            comment={comment}
            userId={userId}
        />;
        setComments(function(cards) {
            return [card, ...cards];
        });
    };


    async function handleScroll(event) {
        if (fetchingComments.current || !moreComments.current) {
            return;
        }
        const target = event.target;
        const scrollPos = target.scrollTop + target.clientHeight;
        if (scrollPos !== target.scrollHeight) {
            return;
        }
        
        fetchingComments.current = true;
        const res = await apiManager.getPostComments(
            postId, pageNum.current
        );
        fetchingComments.current = false;
        if (res.errors) {
            errorRef.current.showError("Server error");
            return;
        }

        pageNum.current += 1;
        moreComments.current = res.moreComments;

        headerRef.current.updateUser(res.user);
        const userId = (res.user) ? res.user.id : null;
        setComments(function(cards) {
            const newCards = getCommentCards(
                res.comments, userId
            );
            return [...cards, newCards];
        });
    };


    if (!post) {
        return (
        <main className="post-page">
            <LoadingElement />
        </main>
        );
    }


    return (
    <main className="post-page" onScroll={handleScroll}>
        <section className="post-section">
            <div className="post-info">   
                <div className="post-author-info">
                    <div className="post-author-img-wrapper">
                    {(post.profile_img_url) ?
                    <img src={post.profile_img_url}/>
                    :
                    <img src={defaultImg} className="default"/>
                    }
                    </div>
                    <p className="post-author-username">
                        {post.username}
                    </p>
                </div>
                <p className="post-date">{post.date}</p>
            </div>
            <p className="post-title">{post.title}</p>
            <p className="post-content">{post.content}</p>
            <div className="post-likes-section">
                {!user ||
                <button onClick={toggleLike}>
                    {(likesInfo.likedPost) ? "Unlike" : "Like"}
                </button>
                }
                <p className="post-likes">
                    {likesInfo.display}
                </p>
                <img 
                    src={featherImg} 
                    className="post-likes-img" 
                    alt="feather" 
                />
            </div>
        </section>
        <section className="comments-section">
            <CommentForm 
                user={user} 
                postId={postId}
                newCommentCb={newCommentCb}
            />
            <div className="comments">
                {comments}
            </div>
        </section>
    </main>
    );
};



export default PostPage;