import "../styles/requestCard.css";
import defaultImg from "../assets/account.svg";
import closeImg from "../assets/close.svg";
import yesImg from "../assets/check.svg";
import deleteImg from "../assets/delete.svg";
import { useState, useRef } from "react";



function RequestCard({request, sent}) {
    const username = useRef(
        (sent) ? request.receiving_user_username : 
        request.sending_user_username
    );
    const profileImg = useRef(
        (sent) ? request.receiving_user_profile_img_url :
        request.sending_user_profile_img_url
    );
    const [showDel, setShowDel] = useState(false);


    function toggleDel() {
        setShowDel(!showDel);
    };


    return (
    <div className="request-card">
        <div className="request-user">
            <div className="request-user-img-wrapper">
                {(profileImg.current) ?
                <img src={profileImg.current} />
                :
                <img src={defaultImg} className="default" />
                }
            </div>
            <p>{username.current}</p>
        </div>
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
                onClick={null}
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
                onClick={4}
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