import React from "react";
import { PopAppState, pages } from '../redux-data/types';
import { connect } from "react-redux";
import { setCurrentPage } from '../redux-data/actions';
import "../scss/welcomePage.css";
import PopLogo from "../assets/PopLogo.png";

class WelcomePage extends React.Component<any> {
    render() {
        return (
            <div className="LandingPage">
                <span className="ImageStack">
                <img className="logo" src={PopLogo} alt="POP LOGO" height="80%" width="20%"></img>
                </span>
                <div id="content">
                <span className="join">Join an anonymous discussion platform to learn more about the world!</span>
                <br/>
                <div className="SigninRow">
                    <button className="SignIn" onClick={(e) => this.props.setCurrentPage(pages.SigninPage)} >Sign In</button>
                    <button className="SignUp" onClick={(e) => this.props.setCurrentPage(pages.SignupPage)}>Sign Up</button>
                </div>
                <span className="Dont">Don't feel like posting? No problem!</span> 
                <button className="Browse" onClick={(e) => this.props.setCurrentPage(pages.HomePage)}>Browse</button>
                </div>
            </div>

        );
    }
}
  

function mapStateToProps(state: PopAppState) {
    return {    }
  }
  
  const mapDispatchToProps = {
      setCurrentPage
  }
  
  export default connect(mapStateToProps, mapDispatchToProps)(WelcomePage);