import "../styles/usersPage.css";
import apiManager from "../utils/apiManager.js";
import { useEffect, useState, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import LoadingElement from "../components/loadingElement.jsx";
import UserCard from "./userCard.jsx";



function UsersPage() {
    const headerRef = useOutletContext();
    const [searchVal, setSearchVal] = useState("");
    const [users, setUsers] = useState(null);
    const pageNum = useRef(1);
    const moreUsers = useRef(false);
    const fetchingUsers = useRef(false);



    useEffect(function() {
        apiManager.getUsers(0).then(function(res) {
            if (res.errors) {
                return;
            }

            moreUsers.current = res.moreUsers;
            headerRef.current.updateUser(res.user);
            const userId = (res.user) ? res.user.id : null;
            setUsers(getUserCards(res.users, userId));
        });
    }, [headerRef]);


    function handleSearchChange(event) {
        setSearchVal(event.target.value);
    };


    function getUserCards(users, userId) {
        const cards = [];
        for (let user of users) {
            cards.push(
                <UserCard 
                    key={user.id}
                    user={user}
                    userId={userId}
                />
            );
        }
        return cards;
    };


    async function handleScroll(event) {
        if (fetchingUsers.current || !moreUsers.current) {
            return;
        }

        const target = event.target;
        const scrollPos = target.scrollTop + 
        target.clientHeight;
        if (target.scrollHeight !== scrollPos) {
            return;
        }
        
        fetchingUsers.current = true;
        const res = await apiManager.getUsers(
            pageNum.current
        );
        fetchingUsers.current = false;
        if (res.errors) {
            return;
        }

        pageNum.current += 1;
        moreUsers.current = res.moreUsers;
        const userId = (res.user) ? res.user.id : null;
        setUsers(function(cards) {
            const newCards = getUserCards(res.users, userId);
            return [...cards, newCards];
        });
    };


    if (!users) {
        return (
            <main className="users-page">
                <LoadingElement />
            </main>
        );
    }


    return (
    <main className="users-page" onScroll={handleScroll}>
        <section className="search-section">
                <input 
                    type="text" 
                    placeholder="username"
                    value={searchVal}
                    onChange={handleSearchChange} 
                />
                <button>Search</button>
        </section>
        <div className="users">
            {users}
        </div>
    </main>
    );
};



export default UsersPage;