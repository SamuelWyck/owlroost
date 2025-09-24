import "../styles/loadingElement.css";
import logoImg from "../assets/owl.svg";



function LoadingElement() {
    return (
        <div className="loading-img-wrapper">
            <img src={logoImg} />
        </div>
    );
};



export default LoadingElement;