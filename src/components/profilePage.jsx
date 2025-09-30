import "../styles/profilePage.css";
import defaultImg from "../assets/account.svg";
import { useParams, useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import apiManager from "../utils/apiManager.js";



function ProfilePage() {
    const {userId} = useParams();
    const headerRef = useOutletContext();
    const [user, setUser] = useState(null);


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
            if (postsRes.user) {
                setUser(postsRes.user);
            }
        });
    }, [userId, headerRef]);


    return (
    <main className="profile-page">
        <section className="profile-section">
            <div className="profile-img-wrapper">
                <img src={defaultImg} alt="" />
            </div>
            <p className="profile-info"></p>
        </section>
    </main>
    );
};



export default ProfilePage;