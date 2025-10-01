import "../styles/userCard.css";
import { useState, useRef, useContext } from "react";
import { Link } from "react-router-dom";
import defaultImg from "../assets/account.svg";
import apiManager from "../utils/apiManager.js";
import {ErrorContext} from "../utils/context.js";



function UserCard({user, userId}) {
    const errorRef = useContext(ErrorContext);
    const fetching = useRef(false);
    const [contactMade, setContactMade] = useState(
        checkUserContact()
    );


    function checkUserContact() {
        if (!userId) {
            return null;
        }

        // for (let id of user.followed_users) {
        //     if (id === userId) {
        //         return true;
        //     }
        // }
        for (let id of user.following_users) {
            if (id === userId) {
                return true;
            }
        }
        // for (let id of user.sent_requests) {
        //     if (id === userId) {
        //         return true;
        //     }
        // }
        for (let id of user.received_requests) {
            if (id === userId) {
                return true;
            }
        }
        return false;
    };


    async function followUser(event) {
        event.preventDefault();
        if (fetching.current) {
            return;
        }

        fetching.current = true;
        const res = await apiManager.followUser(user.id);
        fetching.current = false;
        if (res.errors) {
            errorRef.current.showError("Server error");
            return;
        }

        setContactMade(true);
    };


    async function unfollowUser(event) {
        event.preventDefault();
        if (fetching.current) {
            return;
        }

        fetching.current = true;
        const res = await apiManager.unfollowUser(user.id);
        fetching.current = false;
        if (res.errors) {
            errorRef.current.showError("Server error");
            return;
        }

        setContactMade(false);
    };


    return (
    <Link to={`/users/${user.id}`} className="user-card-link">
    <div className="user-card">
        <div className="user-info">
            <div className="user-card-img-wrapper">
                {(user.profile_img_url) ?
                <img src={user.profile_img_url} />
                :
                <img src={defaultImg} className="default" />
                }
            </div>
            <p className="user-card-username">
                {user.username}
            </p>
        </div>
        {contactMade === null ||
        <div className="follow-wrapper">
            {(contactMade) ?
            <button 
                key={0}
                onClick={unfollowUser}
            >Unfollow user</button>
            :
            <button 
                key={1} 
                onClick={followUser}
            >Follow user</button>
            }
        </div>
        }
    </div>
    </Link>
    );
};



export default UserCard;