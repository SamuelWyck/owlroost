import "../styles/profilePage.css";
import defaultImg from "../assets/account.svg";
import { useParams, useOutletContext } from "react-router-dom";
import { useState, useEffect, useRef, useContext } from "react";
import apiManager from "../utils/apiManager.js";
import PostCard from "./postCard.jsx";
import CommentCard from "./commentCard.jsx";
import UserCard from "./userCard.jsx";
import LoadingElement from "./loadingElement.jsx";
import RequestCard from "./requestCard.jsx";
import {ErrorContext} from "../utils/context.js";



function ProfilePage() {
    const {userId} = useParams();
    const headerRef = useOutletContext();
    const errorRef = useContext(ErrorContext);
    const fetching = useRef(false);
    const arePosts = useRef(true);
    const [media, setMedia] = useState();
    const [sentReqs, setSentReqs] = useState([]);
    const [incomingReqs, setIncomimgReqs] = useState([]);
    const [followedUsers, setFollowedUsers] = useState(null);
    const [profileUser, setProfileUser] = useState(null);
    const [clientUserId, setClientUserId] = useState(null);
    const [clientFollowing, setClientFollowing] = useState(null);
    const [showImgDel, setShowImgDel] = useState(false);
    const [infoVal, setInfoVal] = useState("");


    useEffect(function() {
        Promise.all([
            apiManager.getUserProfile(userId),
            apiManager.getUserPosts(userId)
        ]).then(function(res) {
            console.log(res)
            const [profileRes, postsRes] = res;
            if (profileRes.errors || postsRes.errors) {
                errorRef.current.showError("Server error");
                return;
            }

            headerRef.current.updateUser(postsRes.user);

            const clientUserId = (postsRes.user) ? 
            postsRes.user.id : null;
            setClientUserId(clientUserId);

            setMedia(getMediaCards(
                postsRes.posts, clientUserId
            ));
            setProfileUser(profileRes.profile.user);
            setClientFollowing(profileRes.followingUser);
            if (!profileRes.profile.user.info) {
                setInfoVal("");
            } else {
                setInfoVal(profileRes.profile.user.info);
            }

            const [sent, received] = getReqCards(
                profileRes.profile.follow_requests, 
                clientUserId
            );
            setIncomimgReqs(received);
            setSentReqs(sent);
            setFollowedUsers(getUserCards(
                profileRes.profile.user.followed,
                clientUserId
            ));
        });
    }, [userId, headerRef, errorRef]);


    function getMediaCards(media, userId) {
        const Element = (arePosts.current) ? 
        PostCard : CommentCard;
        const cards = [];
        for (let item of media) {
            cards.push(
                <Element 
                    key={
                        (item.post_id) ? 
                        item.post_id : item.id
                    }
                    userId={userId}
                    comment={item}
                    post={item}
                />
            );
        }
        return cards;
    };


    function getReqCards(followReqs, userId) {
        if (!followReqs) {
            return [[], []];
        }

        const sent = [];
        const received = [];
        for (let req of followReqs) {
            if (!req) {
                continue;
            }
            if (req.sending_user_id === userId) {
                sent.push(
                    <RequestCard
                        request={req}
                        key={req.request_id}
                        sent={true}
                        delCb={requestDelCb}
                    />
                );
            } else {
                received.push(
                    <RequestCard
                        key={req.request_id}
                        sent={false}
                        request={req}
                        delCb={requestDelCb}
                    />
                );
            }
        }
        return [sent, received];
    };


    function getUserCards(users, userId) {
        const cards = [];
        for (let user of users) {
            if (!user.id) {
                continue;
            }
            cards.push(
                <UserCard
                    user={user}
                    key={user.id}
                    userId={userId}
                />
            );
        }
        return cards;
    };


    async function toggleFollow() {
        if (fetching.current) {
            return;
        }

        fetching.current = true;
        let res = null;
        if (clientFollowing) {
            res = await apiManager.unfollowUser(userId);
        } else {
            res = await apiManager.followUser(userId);
        }
        fetching.current = false;
        if (res.errors) {
            errorRef.current.showError("Server error");
            return;
        }

        setClientFollowing(!clientFollowing);
    };


    async function updateInfo() {
        if (profileUser.info === infoVal) {
            return;
        }

        let reqBody = {
            info: infoVal
        };
        reqBody = JSON.stringify(reqBody);

        const res = await apiManager.updateUserInfo(reqBody);
        if (res.errors) {
            errorRef.current.showError(
                res.errors[0].msg
            );
            return;
        }

        profileUser.info = infoVal;
    };


    function toggleImgDel() {
        setShowImgDel(!showImgDel);
    };


    function handleInfoChange(event) {
        setInfoVal(event.target.value);
    };


    function requestDelCb(reqId, sent) {
        const setState = (sent) ? setSentReqs : setIncomimgReqs;
        setState(function(reqs) {
            const savedReqs = [];
            for (let req of reqs) {
                if (req.props.request.request_id !== reqId) {
                    savedReqs.push(req);
                }
            }
            return savedReqs;
        });
    };


    if (!profileUser) {
        return (
            <main className="profile-page">
                <LoadingElement />
            </main>
        );
    }


    return (
    <main className="profile-page">
        <section className="profile-section">
            <div className="follow-user-wrapper">
                <p>{profileUser.username}</p>
                {(!clientUserId || clientUserId === userId)  ||
                <>
                {(clientFollowing) ?
                <button
                    key={0}
                    onClick={toggleFollow}
                >Unfollow</button>
                :
                <button
                    key={1}
                    onClick={toggleFollow}
                >Follow</button>
                }
                </>
                }
            </div>
            <div className="profile-details">
                <div className="profile-img-info">
                    <div className="profile-img-wrapper">
                        {(profileUser.profile_img_url) ?
                        <img src={profileUser.profile_img_url}/>
                        :
                        <img 
                            src={defaultImg} 
                            className="default" 
                        />
                        }
                    </div>
                    {(clientUserId !== profileUser.id) ||
                    <div className="img-options">
                        {(showImgDel) ?
                        <>
                        <button
                            key={0}
                            onClick={toggleImgDel}
                        >Cancel</button>
                        <button
                            key={1}
                        >Delete</button>
                        </>
                        :
                        <>
                        <button
                            key={2}
                            onClick={toggleImgDel}
                        >Delete image</button>
                        <form>
                            <label htmlFor="image">
                                Upload image
                            </label>
                            <input 
                                type="file" 
                                name="image" 
                                id="image"
                            />
                        </form>
                        </>
                        }
                    </div>
                    }
                </div>
                {(clientUserId === userId) ?
                <div className="profile-info-edit">
                    <textarea 
                        name="info" 
                        id="profile-info"
                        value={infoVal}
                        onChange={handleInfoChange}
                        maxLength={3000}
                    ></textarea>
                    <button onClick={updateInfo}>Save</button>
                </div>
                :
                <>
                {(infoVal.length <= 0) || 
                <p className="profile-info">
                    {infoVal}
                </p>
                }
                </>
                }
            </div>
        </section>
        <section className="following-section">
            {(sentReqs.length <= 0) ||
            <div className="sent-reqs">
                <p>Sent Follow Requests</p>
                <div>
                    {sentReqs}
                </div>
            </div>
            }
            {(incomingReqs.length <= 0) ||
            <div className="incoming-reqs">
                <p>Follow Requests</p>
                <div>
                    {incomingReqs}
                </div>
            </div>
            }
            <div className="followed-user">
                <p>Followed Users</p>
                <div>
                    {followedUsers}
                </div>
            </div>
        </section>
        <section className="media-section">
            <div className="media-options">
                <button>Posts</button>
                <button>Comments</button>
                <button>Followed posts</button>
            </div>
            <div className="media">
                {media}
            </div>
        </section>
    </main>
    );
};



export default ProfilePage;