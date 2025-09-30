import "../styles/header.css";
import { Component } from "react";
import logoImg from "../assets/owl.svg";
import { Link } from "react-router-dom";
import defaultImg from "../assets/account.svg";
import menuImg from "../assets/menu.svg";
import { Navigate } from "react-router-dom";
import apiManager from "../utils/apiManager.js";



class Header extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: null,
            nav: null
        };

        this.updateUser = this.updateUser.bind(this);
        this.logOut = this.logOut.bind(this);
    };


    updateUser(user) {
        if (!this.state.user && !user) {
            return;
        }
        if (this.state.user && user && 
        this.state.user.id === user.id && 
        this.state.user.profile_img_url === user.profile_img_url) {
            return;
        }

        this.setState(function(state) {
            return {...state, user};
        });
    };


    async logOut() {
        const res = await apiManager.logoutUser();
        if (res.errors) {
            return;
        }

        this.setState(function(state) {
            return {
                ...state, 
                nav: <Navigate to="/login" replace={true} />
            };
        });
    };


    render() {
        function toggleUserMenu(event) {
            event.stopPropagation();

            const userMenu = document.querySelector(
                ".user-menu"
            );
            userMenu.classList.toggle("hidden");
        };


        function toggleHeaderMenu(event) {
            event.stopPropagation();

            const userMenu = document.querySelector(
                ".user-menu"
            );
            if (userMenu) {
                userMenu.classList.add("hidden");
            }

            const headerMenu = document.querySelector(
                ".header-menu"
            );
            headerMenu.classList.toggle("hidden");
        };


        if (this.state.nav) {
            return this.state.nav;
        }


        return (
        <header>
            <Link to="/">
                <div className="banner">
                    <div className="logo-img-wrapper">
                        <img src={logoImg} alt="owl" />
                    </div>
                    <p className="banner-title">Owlroost</p>
                </div>
            </Link>
            <nav>
                <button 
                    className="header-menu-btn"
                    onClick={toggleHeaderMenu}
                >
                    <img src={menuImg} alt="menu" />
                </button>
                <div className="header-menu hidden">
                    {(this.state.user) ?
                    <>
                    <Link to="/hoots/new">Write</Link>
                    <Link to="/users">Users</Link>
                    </>
                    :
                    <>
                    <Link to="/login">Log in</Link>
                    <Link to="/signup">Sign up</Link>
                    <Link to="/users">Users</Link>
                    </>
                    }
                </div>
                {(this.state.user) ?
                <>
                <div className="user-menu-btn-wrapper">
                <button 
                    className="user-menu-btn" 
                    onClick={toggleUserMenu}
                >
                    <img 
                        className={
                            (this.state.user.profile_img_url) ?
                            "user-profile-img" : 
                            "user-profile-img default"

                        }
                        src={
                            (this.state.user.profile_img_url) ?
                            this.state.user.profile_img_url :
                            defaultImg
                        }
                    />
                </button>
                {!this.state.user ||
                <div className="user-menu hidden">
                    <Link 
                        to={`/users/${this.state.user.id}`}
                    >Profile</Link>
                    <button onClick={this.logOut}>Log out</button>
                </div>
                }
                </div>
                </>
                :
                null
                }
            </nav>
        </header>
        );
    };
};



export default Header;