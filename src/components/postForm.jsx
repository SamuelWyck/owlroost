import "../styles/postForm.css";
import { useState } from "react";
import apiManager from "../utils/apiManager.js";
import { useNavigate } from "react-router-dom";



function PostForm(
    {titleValue="", contentValue="", postId, edit}) {
    const navigate = useNavigate();
    const [showDel, setShowDel] = useState(false);
    const [titleVal, setTitleVal] = useState(titleValue);
    const [contentVal, setContentVal] = useState(contentValue);
    const [errors, setErrors] = useState(null);


    function toggleShowDel() {
        setShowDel(function(showDel) {
            return !showDel;
        });
    };


    function handleTitleChange(event) {
        setTitleVal(event.target.value);
    };


    function handleContentChange(event) {
        setContentVal(event.target.value);
    };


    async function createPost(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        let reqBody = {};
        for (let entry of formData.entries()) {
            const [key, value] = entry;
            reqBody[key] = value;
        }
        reqBody = JSON.stringify(reqBody);

        const res = await apiManager.createPost(reqBody);
        if (res.errors) {
            setErrors(getErrorCards(res.errors));
            return;
        }

        navigate("/");
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


    async function editPost(event) {
        event.preventDefault();

        const formdata = new FormData(event.target);
        let reqBody = {};
        for (let entry of formdata.entries()) {
            const [key, value] = entry;
            reqBody[key] = value;
        }
        reqBody = JSON.stringify(reqBody);

        const res = await apiManager.editPost(reqBody, postId);
        if (res.errors) {
            setErrors(getErrorCards(res.errors));
            return;
        }

        navigate("/");
    };


    async function deletePost() {
        const res = await apiManager.deletePost(postId);
        if (res.errors) {
            setErrors(getErrorCards(res.errors));
            return;
        }

        navigate("/", {replace: true});
    };


    return (
        <form 
            className="post-form"
            onSubmit={(edit) ? editPost : createPost}
        >   
            {!errors ||
            <ul className="errors">
                {errors}
            </ul>
            }
            <div>
                <input 
                    type="text" 
                    name="title" 
                    placeholder="Title" 
                    value={titleVal}
                    onChange={handleTitleChange}
                    maxLength={200}
                    required
                />
            </div>
            <div>
                <textarea 
                    name="content" 
                    placeholder="Content"
                    value={contentVal}
                    onChange={handleContentChange}
                    maxLength={11000}
                    minLength={10}
                    required
                ></textarea>
            </div>
            <div>
                {(edit) ?
                <>
                {(showDel) ?
                <>
                <button 
                    type="button" 
                    onClick={toggleShowDel}
                >Cancel</button>
                <button 
                    type="button"
                    onClick={deletePost}
                >Delete</button>
                </>
                :
                <>
                <button 
                    type="button"
                    onClick={toggleShowDel}
                >Delete</button>
                <button>Save</button>
                </>
                }
                </>
                :
                <button>Hoot</button>
                }
            </div>
        </form>
    );
};



export default PostForm;