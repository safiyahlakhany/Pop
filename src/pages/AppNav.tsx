import React from 'react';
import '../scss/App.css';
import {PopAppState, pages } from '../redux-data/types';
import {connect} from "react-redux"
import SignInPage  from './signInPage';
import SignupPage from './signupPage'; 
import HomePage from './homePage';
import Navbar from '../components/Navbar';
import PostPage from './postPage';
import ProfilePage from './profilePage';
import Sidebar from '../components/Sidebar';
import { ScrollablePane, ScrollbarVisibility } from 'office-ui-fabric-react/lib/ScrollablePane';
import { Sticky, StickyPositionType } from 'office-ui-fabric-react/lib/Sticky';


class App extends React.Component<any> {
  render() {
    return (
      <div className="AppNav">
        <ScrollablePane scrollbarVisibility={ScrollbarVisibility.always}>
          <Sticky stickyPosition={StickyPositionType.Header}>
            {this.props.page !== pages.SignupPage && this.props.page !== pages.SigninPage ? (
            [<Navbar /> ,<Sidebar/>]): <Navbar/>}
          </Sticky>
        {this.changePageFunction(this.props.page)}
        </ScrollablePane>
      </div>
    );
  }
  private changePageFunction(currentPage: pages) {
    switch (currentPage) {
      case pages.SigninPage:
        return <SignInPage />;
      case pages.SignupPage:
        return <SignupPage/>;
      case pages.WelcomePage:
        return <App />;
      case pages.HomePage:
          return <HomePage />;
      case pages.PostPage:
          return <PostPage />
      case pages.ProfilePage:
          return <ProfilePage />
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
