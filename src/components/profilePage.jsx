import "../styles/profilePage.css";
import defaultImg from "../assets/account.svg";
import { useParams, useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import apiManager from "../utils/apiManager.js";



function ProfilePage() {
    const {userId} = useParams();
    const headerRef = useOutletContext();


    useEffect(function() {
        Promise.all([
            apiManager.getUserPosts(userId),
            apiManager.getUserProfile(userId)
        ]).then(function(res) {
            console.log(res)
        })
    }, [userId]);


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