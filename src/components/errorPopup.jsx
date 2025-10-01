import "../styles/errorPopup.css";
import { Component } from "react";
import closeImg from "../assets/close.svg";



class ErrorPopup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            msg: ""
        };

        this.showError = this.showError.bind(this);
        this.handleClick = this.handleClick.bind(this);
    };


    showError(msg) {
        this.setState(function(state) {
            return {...state, msg: msg};
        });
    };


    handleClick() {
        this.setState(function(state) {
            return {...state, msg: ""};
        });
    };


    render() {
        if (this.state.msg === "") {
            return null;
        }


        return (
        <div className="error-popup">
            <p className="error-msg">
                {this.state.msg}
            </p>
            <button onClick={this.handleClick}>
                <img src={closeImg} alt="close" />
            </button>
        </div>
        );
    };
};



export default ErrorPopup;