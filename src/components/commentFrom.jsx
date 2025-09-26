import "../styles/commentForm.css";
import { Link } from "react-router-dom";
import apiManager from "../utils/apiManager.js";
import { useState } from "react";



function CommentForm({postId, user, newCommentCb}) {
    const [errors, setErrors] = useState(null);


    async function createComment(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        let reqBody = {};
        for (let entry of formData.entries()) {
            const [key, value] = entry;
            reqBody[key] = value;
        }
        reqBody = JSON.stringify(reqBody);

        const res = await apiManager.createComment(reqBody);
        if (res.errors) {
            setErrors(getErrorCards(res.errors));
            return;
        }

        event.target.reset();
        setErrors(null);
        res.comment.profile_img_url = user.profile_img_url;
        res.comment.username = user.username;
        newCommentCb(res.comment);
    };


    function getErrorCards(errors) {
        const cards = [];
        for (let error of errors) {
            cards.push(
                <li
                    className="error"
                    key={error.msg}
                >{error.msg}</li>
            );
        }
        return cards;
    };


    if (!user) {
        return <Link 
            to="/login"
            className="comment-form-link"
        >Log in to comment</Link>
    }


    return (
        <form className="comment-form" onSubmit={createComment}>
            {!errors ||
            <ul className="errors">
                {errors}
            </ul>
            }
            <textarea 
                name="content" 
                id="comment-area"
                placeholder="leave comment"
            ></textarea>
            <input 
                type="text" 
                value={postId} 
                hidden 
                name="postId" 
                readOnly
            />
            <button>Comment</button>
        </form>
    );
};



export default CommentForm;