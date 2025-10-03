import "../styles/commentCard.css";
import defaultImg from "../assets/account.svg";
import editImg from "../assets/pencil.svg";
import deleteImg from "../assets/delete.svg";
import closeImg from "../assets/close.svg";
import saveImg from "../assets/save.svg";
import { useState, useRef } from "react";
import { formatDate } from "../utils/formatters.js";
import apiManager from "../utils/apiManager.js";
import { Link } from "react-router-dom";



function CommentCard({comment, userId}) {
    const dateRef = useRef(formatDate(comment.timestamp));
    const [showDel, setShowDel] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [deleted, setDeleted] = useState(false);
    const [textVal, setTextVal] = useState(comment.content);
    const [errors, setErrors] = useState(null);
    const sentEditRef = useRef(false);


    if (deleted) {
        return null;
    }


    function toggleDel() {
        setShowDel(!showDel);
    };


    function toggleEdit() {
        if (sentEditRef.current) {
            return;
        }

        if (showEdit) {
            setTextVal(comment.content);
            setErrors(null);
        }
        setShowEdit(!showEdit);
    };


    function handleChange(event) {
        setTextVal(event.target.value);
    };


    function getErrorCards(errors) {
        const cards = [];
        for (let error of errors) {
            cards.push(
                <li className="error" key={error.msg}>
                    {error.msg}
                </li>
            );
        }
        return cards;
    };


    async function deleteComment() {
        const res = await apiManager.deleteComment(comment.id);
        if (res.errors) {
            setErrors(getErrorCards(res.errors));
            return;
        }

        setDeleted(true);
    };


    async function editComment() {
        if (sentEditRef.current) {
            return;
        }
        if (comment.content === textVal) {
            toggleEdit();
            return;
        }

        sentEditRef.current = true;
        let reqBody = {
            content: textVal
        };
        reqBody = JSON.stringify(reqBody);

        const res = await apiManager.editComment(
            comment.id, reqBody
        );
        sentEditRef.current = false;
        if (res.errors) {
            setErrors(getErrorCards(res.errors));
            return;
        }

        comment.content = textVal;
        setErrors(null);
        toggleEdit();
    };


    return (
    <div className="comment-card">
        <div className="comment-card-info">
            <Link 
                className="comment-card-author"
                to={`/users/${comment.author_id}`}
            >
                <div className="comment-card-img-wrapper">
                    {(comment.profile_img_url) ?
                    <img src={comment.profile_img_url}/>
                    :
                    <img src={defaultImg} className="default"/>
                    }
                </div>
                <p className="comment-card-author-name">
                    {comment.username}
                </p>
            </Link>
        </div>
        <p className="comment-card-date">
            {dateRef.current}
        </p>
        {(!errors) ||
        <ul className="errors">
            {errors}
        </ul>
        }
        {(showEdit) ?
        <textarea 
            name="content" 
            id="comment-card-edit"
            value={textVal}
            onChange={handleChange}
            required
            maxLength={6000}
        ></textarea>
        :
        <p className="comment-card-content">
            {comment.content}
        </p>
        }
        {comment.author_id !== userId ||
        <div className="comment-card-options">
            {(!showDel && !showEdit) ?
            <>
            <button key={0} onClick={toggleDel}>
                <img src={deleteImg} alt="delete" />
            </button>
            <button key={1} onClick={toggleEdit}>
                <img src={editImg} alt="edit" />
            </button>
            </>
            :
            <>
            {(showDel) ?
            <>
            <button key={2} onClick={toggleDel}>
                <img src={closeImg} alt="cancel" />
            </button>
            <button key={3} onClick={deleteComment}>
                <img src={deleteImg} alt="delete" />
            </button>
            </>
            :
            <>
            <button key={4} onClick={toggleEdit}>
                <img src={closeImg} alt="cancel" />
            </button>
            <button key={5} onClick={editComment}>
                <img src={saveImg} alt="save" />
            </button>
            </>
            }
            </>
            }
        </div>
        }
    </div>  
    );
};



export default CommentCard;