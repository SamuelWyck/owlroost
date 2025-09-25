import "../styles/postCard.css";
import defaultImg from "../assets/account.svg";
import featherImg from "../assets/feather.svg";
import editImg from "../assets/pencil.svg";
import { Link, useNavigate } from "react-router-dom";



function PostCard({post, userId}) {
    const navigate = useNavigate();


    function handleEditBtn(event) {
        event.preventDefault();
        navigate(`/hoots/${post.post_id}/edit`);
    };


    return (
    <Link to={`hoots/${post.post_id}`} className="post-link">
    <div className="post-card">
        <div className="post-card-user-info">
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
            <p>{post.date}</p>
        </div>
        <p className="post-card-title">
            {post.title}
        </p>
        <div className="post-card-meta-info">
        <div className="post-card-likes">
            <p>{post.displayLikes}</p>
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