import "../styles/postCard.css";
import defaultImg from "../assets/account.svg";
import featherImg from "../assets/feather.svg";
import editImg from "../assets/pencil.svg";
import { Link, useNavigate } from "react-router-dom";
import {formatDate, formatNumber} from "../utils/formatters.js";
import { useRef } from "react";



function PostCard({post, userId}) {
    const navigate = useNavigate();
    const dateRef = useRef(formatDate(post.date));
    const likesref = useRef(formatNumber(post.likes));


    function handleEditBtn(event) {
        event.preventDefault();
        navigate(`/hoots/${post.post_id}/edit`);
    };


    function goToUserProfile(event) {
        event.preventDefault();
        navigate(`/users/${post.author_id}`);
    };


    return (
    <Link to={`/hoots/${post.post_id}`} className="post-link">
    <div className="post-card">
        <div 
            className="post-card-user-info" 
            tabIndex={0}
            onClick={goToUserProfile}
        >
            <div className="post-card-user-img-wrapper">
                {(post.profile_img_url) ?
                <img src={post.profile_img_url}/>
                :
                <img src={defaultImg} className="default"/>
                }
            </div>
            <p className="post-author">{post.username}</p>
        </div>
        <div className="post-card-date">
            <p>{dateRef.current}</p>
        </div>
        <p className="post-card-title">
            {post.title}
        </p>
        <div className="post-card-meta-info">
        <div className="post-card-likes">
            <p>{likesref.current}</p>
            <img src={featherImg} alt="feather" />
        </div>
        {(post.author_id !== userId) ||
            <button 
                className="post-edit-btn" 
                onClick={handleEditBtn}
            >
                <img src={editImg} alt="pencil" />
            </button>
        }
        </div>
    </div>
    </Link>
    );
};



export default PostCard;