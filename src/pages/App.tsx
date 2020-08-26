import React from 'react';
import '../scss/App.css';
import {PopAppState, pages } from '../redux-data/types';
import {connect} from "react-redux"
import WelcomePage from './welcomePage';
import AppNav from './AppNav';
import 'firebase/database';


class App extends React.Component<any> {
  render() {
    return (
      <div className="App">{this.changePageFunction(this.props.page)}</div>
    );
  }

  private changePageFunction(currentPage: pages) {
    switch (currentPage) {
      case pages.SignupPage:
        return <AppNav />;
      case pages.WelcomePage:
        return <WelcomePage />; 
      case pages.HomePage:
      case pages.PostPage:
      case pages.SigninPage:
      case pages.ProfilePage:
          return <AppNav/>;
      default:
        return <div>ERROR</div>;
    }
  };
}

function mapStateToProps(state: PopAppState) {
  return {
      page: state.currentPage
  }
}

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
