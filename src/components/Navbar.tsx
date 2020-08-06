import React from "react";
import { PopAppState, pages } from '../redux-data/types';
import { connect } from "react-redux";
import { setCurrentPage } from '../redux-data/actions';
import PopLogo from "../assets/PopLogo.png";
import '../scss/Navbar.css'; 
import { Icon } from '@fluentui/react/lib/Icon';
import profPic from '../assets/profPic.png';
import { mergeStyles } from 'office-ui-fabric-react/lib/Styling';

const iconClass = mergeStyles({
    color:"white",
    fontSize: 50,
    height: 50,
    width: 50,
    margin: '0 25px',
  });

class Navbar extends React.Component<any> {
    render() {
        return (
            <div className="navbar">
                <img id = "logo" src={PopLogo} alt="pop logo" onClick={(e) => this.props.setCurrentPage(pages.HomePage)}/>
                <div id = "search-container">
                    <Icon iconName="Search" className={iconClass} />
                    <input id = "search-bar" type="text" placeholder="Search"/>
                </div>
                {this.props.currentUser !== "" ?
                <img id = "profile" alt="profile logo" src={profPic} onClick={(e) => this.props.setCurrentPage(pages.ProfilePage)} />
                : 
                <img id = "profile" alt="profile logo" src={profPic} onClick={(e) => this.props.setCurrentPage(pages.WelcomePage)} />
                }  
            </div>
            
        );
    }
}

function mapStateToProps(state: PopAppState) {
    return {currentUser: state.currentUser}
  }
  
  const mapDispatchToProps = {
      setCurrentPage
  }
  
  export default connect(mapStateToProps, mapDispatchToProps)(Navbar);