import "../styles/requestCard.css";
import defaultImg from "../assets/account.svg";
import closeImg from "../assets/close.svg";
import yesImg from "../assets/check.svg";
import deleteImg from "../assets/delete.svg";
import { useState, useRef, useContext } from "react";
import { Link } from "react-router-dom";
import apiManager from "../utils/apiManager.js";
import { ErrorContext } from "../utils/context.js";



function RequestCard({request, sent, delCb}) {
    const errorRef = useContext(ErrorContext);
    const username = useRef(
        (sent) ? request.receiving_user_username : 
        request.sending_user_username
    );
    const profileImg = useRef(
        (sent) ? request.receiving_user_img :
        request.sending_user_img
    );
    const [showDel, setShowDel] = useState(false);


    function toggleDel() {
        setShowDel(!showDel);
    };


    async function delRequest() {
        let res = null;
        if (sent) {
            res = await apiManager.unfollowUser(
                request.receiving_user_id
            );
        } else {
            res = await apiManager.rejectFollowReq(
                request.sending_user_id
            );
        }
        if (res.errors) {
            errorRef.current.showError("Server error");
            return;
        }

        delCb(request.request_id, sent);
    };


    async function acceptRequest() {
        const res = await apiManager.acceptFollowReq(
            request.sending_user_id
        );
        if (res.errors) {
            errorRef.current.showError("Server error");
            return;
        }

        delCb(request.request_id, sent);
    };


    return (
    <div className="request-card">
        <Link 
            to={`/users/${(sent) ? request.receiving_user_id :
                request.sending_user_id}`
            } 
            className="request-user"
        >
            <div className="request-user-img-wrapper">
                {(profileImg.current) ?
                <img src={profileImg.current} />
                :
                <img src={defaultImg} className="default" />
                }
            </div>
            <p>{username.current}</p>
        </Link>
        <div className="request-options">
            {(showDel) ?
            <>
            <button
                key={0}
                onClick={toggleDel}
            >
                <img src={closeImg} alt="cancel" />
            </button>
            <button
                key={1}
                onClick={delRequest}
            >
                <img src={deleteImg} alt="delete" />
            </button>
            </>
            :
            <>
            {(sent) ?
            <button
                key={2}
                onClick={toggleDel}
            >
                <img src={closeImg} alt="delete" />
            </button>
            :
            <>
            <button
                key={3}
                onClick={toggleDel}
            >
                <img src={closeImg} alt="delete" />
            </button>
            <button
                key={4}
                onClick={acceptRequest}
            >
                <img src={yesImg} alt="accept" />
            </button>
            </>
            }
            </>
            }
        </div>
    </div>
    );
};



export default RequestCard;