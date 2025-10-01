import './App.css';
import { Outlet } from 'react-router-dom';
import Header from './components/header.jsx';
import Footer from './components/footer.jsx';
import { useRef, useEffect } from 'react';
import {ErrorContext} from "./utils/context.js";
import ErrorPopup from './components/errorPopup.jsx';



function App() {
	const headerRef = useRef(null);
	const errorRef = useRef(null);


	useEffect(function() {
		function toggleMenus(event) {
			const userMenu = document.querySelector(
				".user-menu"
			);
			if (userMenu) {
				userMenu.classList.add("hidden");
			}

			const target = event.target;
			if (target.matches(".header-menu")) {
				return;
			}

			const headerMenu = document.querySelector(
				".header-menu"
			);
			headerMenu.classList.add("hidden");
		};


		function hideHeaderMenu() {
			if (window.innerWidth <= 500) {
				return;
			}

			const headerMenu = document.querySelector(
				".header-menu"
			);
			headerMenu.classList.add("hidden");
		};



		document.addEventListener("click", toggleMenus);
		window.addEventListener("resize", hideHeaderMenu);

		return function() {
			document.removeEventListener(
				"click", toggleMenus
			);
			window.removeEventListener(
				"resize", hideHeaderMenu
			)
		};
	}, []);


	return (
		<>
		<Header ref={headerRef} />
		<ErrorPopup ref={errorRef} />
		<ErrorContext value={errorRef}>
			<Outlet context={headerRef} />
		</ErrorContext>
		<Footer />
		</>
	);
};



export default App;