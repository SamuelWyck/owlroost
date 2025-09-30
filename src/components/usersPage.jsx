import "../styles/usersPage.css";
import apiManager from "../utils/apiManager.js";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import LoadingElement from "../components/loadingElement.jsx";
import UserCard from "./userCard.jsx";



function UsersPage() {
    const headerRef = useOutletContext();
    const [searchVal, setSearchVal] = useState("");
    const [users, setUsers] = useState(null);


    useEffect(function() {
        apiManager.getUsers().then(function(res) {
            if (res.errors) {
                return;
            }

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


    if (!users) {
        return (
            <main className="users-page">
                <LoadingElement />
            </main>
        );
    }


    return (
    <main className="users-page">
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