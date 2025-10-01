import "../styles/profilePage.css";
import defaultImg from "../assets/account.svg";
import { useParams, useOutletContext } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import apiManager from "../utils/apiManager.js";
import PostCard from "./postCard.jsx";
import CommentCard from "./commentCard.jsx";
import LoadingElement from "./loadingElement.jsx";
import RequestCard from "./requestCard.jsx";



function ProfilePage() {
    const {userId} = useParams();
    const headerRef = useOutletContext();
    const arePosts = useRef(true);
    const [media, setMedia] = useState();
    const [sentReqs, setSentReqs] = useState([]);
    const [incomingReqs, setIncomimgReqs] = useState([]);
    const [profileUser, setProfileUser] = useState(null);
    const [reqUserId, setReqUserId] = useState(null);


    useEffect(function() {
        Promise.all([
            apiManager.getUserProfile(userId),
            apiManager.getUserPosts(userId)
        ]).then(function(res) {
            console.log(res)
            const [profileRes, postsRes] = res;
            if (profileRes.errors || postsRes.errors) {
                return;
            }

            headerRef.current.updateUser(postsRes.user);

            const reqUserId = (postsRes.user) ? 
            postsRes.user.id : null;
            setReqUserId(reqUserId);

            setMedia(getMediaCards(postsRes.posts, reqUserId));
            setProfileUser(profileRes.profile.user);

            const [sent, received] = getReqCards(
                profileRes.profile.follow_requests, reqUserId
            );
            setIncomimgReqs(received);
            setSentReqs(sent);
        });
    }, [userId, headerRef]);


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
                    />
                );
            } else {
                received.push(
                    <RequestCard
                        key={req.request_id}
                        sent={false}
                        request={req}
                    />
                );
            }
        }
        return [sent, received];
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
            <p>{profileUser.username}</p>
            <div className="profile-details">
                <div className="profile-img-info">
                    <div className="profile-img-wrapper">
                        <img src={defaultImg} alt="" />
                    </div>
                    {(reqUserId !== profileUser.id) ||
                    <div className="img-options">
                        <button>Delete image</button>
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
                    </div>
                    }
                </div>
                {(reqUserId === profileUser.id) ?
                    <div className="profile-info-edit">
                        <textarea 
                            name="info" 
                            id="profile-info"
                            value={
                                (profileUser.info) ?
                                profileUser.info : ""
                            }
                        ></textarea>
                        <button>Save</button>
                    </div>
                    :
                    <p className="profile-info">
                        {profileUser.info}
                    </p>
                }
            </div>
        </section>
        <section className="following-section">
            {(sentReqs.length <= 0) ||
            <div className="sent-reqs">
                <p>Sent follow requests</p>
                <div>
                    {sentReqs}
                </div>
            </div>
            }
            {(incomingReqs.length <= 0) ||
            <div className="incoming-reqs">
                <p>Follow requests</p>
                <div>
                    {incomingReqs}
                </div>
            </div>
            }
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