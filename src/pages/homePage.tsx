import React from "react";
import { connect } from "react-redux";
import {setCurrentPage} from "../redux-data/actions"
import { PopAppState } from "../redux-data/types";
import Feed from '../components/Feed'
import '../scss/Sidebar.css'; 

class HomePage extends React.Component<any> {

    render() {
        return (
            <div >
                <Feed  />                
            </div>

        );
    }
}

function mapStateToProps(state: PopAppState) {
    return {   
     }
  }
  
  const mapDispatchToProps = {
      setCurrentPage
  }
  
  export default connect(mapStateToProps, mapDispatchToProps)(HomePage);