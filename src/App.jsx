import './App.css';
import { Outlet } from 'react-router-dom';
import Header from './components/header.jsx';
import Footer from './components/footer.jsx';
import { useRef, useEffect } from 'react';



function App() {
	const headerRef = useRef(null);


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
		<Outlet context={headerRef} />
		<Footer />
		</>
	);
};



export default App;