import "../styles/header.css";
import { Component } from "react";
import logoImg from "../assets/owl.svg";
import { Link } from "react-router-dom";
import defaultImg from "../assets/account.svg";
import menuImg from "../assets/menu.svg";



class Header extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: null
        };

        this.updateUser = this.updateUser.bind(this);
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
                    <Link to="/posts/new">Write</Link>
                    <Link to="/users">Users</Link>
                    </>
                    :
                    <>
                    <Link to="/login">Log in</Link>
                    <Link to="/signup">Sign up</Link>
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
                <div className="user-menu hidden">
                    <Link to="/user">Profile</Link>
                    <button>Log out</button>
                </div>
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