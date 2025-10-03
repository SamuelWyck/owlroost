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
    const postsShown = 0;
    const commentsShown = 1;
    const followedPostsShown = 2;

    const {userId} = useParams();
    const headerRef = useOutletContext();
    const errorRef = useContext(ErrorContext);
    const fetching = useRef(false);
    const morePosts = useRef(false);
    const moreComments = useRef(false);
    const moreFollowedPosts = useRef(false);
    const pPageNum = useRef(1);
    const cmtPageNum = useRef(1);
    const fllwPPageNum = useRef(1);
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState([]);
    const [followedPosts, setFollowedPosts] = useState([]);
    const [mediaShown, setMediaShown] = useState(0);
    const [sentReqs, setSentReqs] = useState([]);
    const [incomingReqs, setIncomimgReqs] = useState([]);
    const [followedUsers, setFollowedUsers] = useState(null);
    const [profileUser, setProfileUser] = useState(null);
    const [clientUserId, setClientUserId] = useState(null);
    const [clientFollowing, setClientFollowing] = useState(null);
    const [showImgDel, setShowImgDel] = useState(false);
    const [infoVal, setInfoVal] = useState("");


    useEffect(function() {
        const pageNum = 0;
        Promise.all([
            apiManager.getUserProfile(userId),
            apiManager.getUserPosts(userId, pageNum)
        ]).then(function(res) {
            const [profileRes, postsRes] = res;
            if (profileRes.errors || postsRes.errors) {
                errorRef.current.showError("Server error");
                return;
            }

            headerRef.current.updateUser(postsRes.user);

            const clientUserId = (postsRes.user) ? 
            postsRes.user.id : null;
            setClientUserId(clientUserId);

            setPosts(getMediaCards(
                postsRes.posts, clientUserId, true
            ));
            setComments([]);
            setFollowedPosts([]);
            setMediaShown(postsShown);
            morePosts.current = postsRes.morePosts;
            moreComments.current = true;
            moreFollowedPosts.current = true;
            pPageNum.current = 1;
            cmtPageNum.current = 0;
            fllwPPageNum.current = 0;

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


    function getMediaCards(media, userId, arePosts) {
        const Element = (arePosts) ? PostCard : CommentCard;
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


    async function fetchMedia(mediaChoice, replaceCards) {
        fetching.current = true;
        let res = null;
        let setState = setPosts;
        let arePosts = true;
        let resMediaKey = "posts";
        let moreRef = morePosts;
        let resMoreKey = "morePosts";
        let pageNumRef = pPageNum;
        if (mediaChoice === postsShown) {
            res = await apiManager.getUserPosts(
                userId, pPageNum.current
            );
        } else if (mediaChoice === commentsShown) {
            setState = setComments;
            arePosts = false;
            resMediaKey = "comments";
            moreRef = moreComments;
            resMoreKey = "moreComments";
            pageNumRef = cmtPageNum;
            res = await apiManager.getUserComments(
                userId, cmtPageNum.current
            );
        } else {
            setState = setFollowedPosts;
            moreRef = moreFollowedPosts;
            pageNumRef = fllwPPageNum;
            res = await apiManager.getUserFollowedPosts(
                userId, fllwPPageNum.current
            );
        }
        fetching.current = false;
        if (res.errors) {
            errorRef.current.showError("Server error");
            return;
        }

        headerRef.current.updateUser(res.user);
        setState(function(cards) {
            const newCards = getMediaCards(
                res[resMediaKey], clientUserId, arePosts
            );

            if (replaceCards) {
                return newCards;
            } else {
                return [...cards, newCards];
            }
        });
        setMediaShown(mediaChoice);
        moreRef.current = res[resMoreKey];
        pageNumRef.current += 1;
    };


    async function toggleMediaShown(mediaChoice) {
        if (mediaChoice === mediaShown) {
            return;
        }
        if (fetching.current) {
            return;
        }
        if ((mediaChoice === postsShown && (posts.length > 0 
        || !morePosts.current)) ||
        (mediaChoice === commentsShown && (comments.length > 0
        || !moreComments.current)) || 
        (mediaChoice === followedPostsShown &&
        (followedPosts.length > 0 || !moreFollowedPosts.current))) {
            setMediaShown(mediaChoice);
            return;
        }

        const replaceCards = true;
        await fetchMedia(mediaChoice, replaceCards);
    };


    async function handleScroll(event) {
        if (fetching.current) {
            return;
        }
        if ((mediaShown === postsShown && !morePosts.current)
            || (mediaShown === commentsShown && !moreComments.current)
        || (mediaShown === followedPostsShown && !moreFollowedPosts.current)) {
            return;
        }
        const target = event.target;
        const scrollPos = target.scrollTop + target.clientHeight;
        if (scrollPos !== target.scrollHeight) {
            return;
        }
        
        const replaceCards = false;
        await fetchMedia(mediaShown, replaceCards);
    };


    function triggerSubmit() {
        const form = document.querySelector(
            ".img-options form"
        );
        form.requestSubmit();
    };


    async function uploadImage(event) {
        event.preventDefault();

        const reqBody = new FormData(event.target);
        const res = await apiManager.uploadImage(reqBody);
        console.log(res)
        event.target.reset();
    };


    if (!profileUser) {
        return (
            <main className="profile-page">
                <LoadingElement />
            </main>
        );
    }


    return (
    <main className="profile-page" onScroll={handleScroll}>
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
                        <form 
                            encType="multipart/form-data"
                            onSubmit={uploadImage}
                        >
                            <label 
                                htmlFor="image"
                                tabIndex={0}
                            >
                                Upload image
                            </label>
                            <input 
                                type="file" 
                                name="image" 
                                id="image"
                                onChange={triggerSubmit}
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
                <button
                    onClick={function() {
                        toggleMediaShown(postsShown);
                    }}
                >Posts</button>
                <button
                    onClick={function() {
                        toggleMediaShown(commentsShown);
                    }}
                >Comments</button>
                <button
                    onClick={function() {
                        toggleMediaShown(followedPostsShown);
                    }}
                >Followed posts</button>
            </div>
            <div className="media">
                {(mediaShown === postsShown) ?
                <>
                {posts}
                </>
                :
                <>
                {(mediaShown === commentsShown) ?
                <>
                {comments}
                </>
                :
                <>
                {followedPosts}
                </>
                }
                </>
                }
            </div>
        </section>
    </main>
    );
};



export default ProfilePage;