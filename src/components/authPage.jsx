import { Link, useNavigate } from "react-router-dom";
import "../styles/authPage.css";
import logoImg from "../assets/owl.svg";
import apiManager from "../utils/apiManager.js";
import { useState, useEffect } from "react";



function AuthPage({signup}) {
    const navigate = useNavigate();
    const [errors, setErrors] = useState(null);


    useEffect(function() {
        apiManager.checkAuthStatus().then(function(res) {
            if (res.errors) {
                return;
            }

            if (res.authenticated) {
                navigate("/", {replace: true});
            }
        });
    }, []);


    async function handleSubmit(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        let reqBody = {};
        for (let entry of formData.entries()) {
            const [key, value] = entry;
            reqBody[key] = value;
        }
        reqBody = JSON.stringify(reqBody);

        let res = null;
        if (signup) {
            res = await apiManager.signupUser(reqBody);
        } else {
            res = await apiManager.loginUser(reqBody);
        }
        if (res.errors) {
            setErrors(getErrorCards(res.errors));
            return;
        }

        navigate("/", {replace: true});
    };


    function getErrorCards(errors) {
        const cards = [];
        for (let error of errors) {
            cards.push(
                <li 
                    key={error.msg} 
                    className="error"
                >{error.msg}</li>
            );
        }
        return cards;
    };


    function handleClick() {
        const authForm = document.querySelector(
            ".auth-modal form"
        );
        authForm.reset();

        setErrors(null);
    };


    return (
    <>
    <p></p>
    <main className="auth-page">
        <div className="auth-modal">
            <div className="auth-banner">
                <p>OwlRoost</p>
                <div className="auth-img-wrapper">
                    <img src={logoImg} alt="" />
                </div>
            </div>
            {!errors ||
            <ul className="errors">
                {errors}
            </ul>
            }
            <form onSubmit={handleSubmit}>
                {!signup ||
                <div>
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email"/>
                </div>
                }
                <div>
                    <label htmlFor="username">Username</label>
                    <input type="text" id="username" name="username" />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password"/>
                </div>
                {!signup ||
                <div>
                    <label htmlFor="confirm">Confirm password</label>
                    <input type="password" id="confirm" name="confirm"/>
                </div>
                }
                <div>
                    <button>{(signup) ? "Sign up" : "Log in"}</button>
                </div>
            </form>
            <Link 
                to={(signup) ? "/login" : "/signup"} 
                onClick={handleClick}
            >
                {`${(signup) ? "Already" : "Don't"} have an account?`}
            </Link>
        </div>
    </main>
    <p></p>
    </>
    );
};



export default AuthPage;