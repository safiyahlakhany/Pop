import React from "react";
import { connect } from "react-redux";
import { PopAppState } from "../redux-data/types";
import  Post  from "./Post";
import { CreatePost } from "./CreatePost"; 
import 'firebase/database';
import firebase from 'firebase/app';

interface homeStates {
    posts: any[]
    postID: any[]
}

interface postProps {
    userID: string
}

class Feed extends React.Component<postProps, homeStates> {
    count: number = 0;
    constructor(props: any, state: homeStates){
        super(props, state);
        this.state = {
            posts:[],
            postID: []
        };
      }

    render() {
      this.count = 0;
        let postList = this.state.posts.map((data) => {
            this.count = this.count + 1;

            if (this.state.postID.length < 1) {
              return (null);
            }
            

            return ( 
                <div key={this.state.postID[this.count - 1]}> 
                {console.log("Hi")}
                    <Post postData={data} postIdentity={this.state.postID[this.count - 1]} />
                </div>
            ) 
        });
        return (
            
            <div className = "feed">
              {this.props.userID !== "" ? ([<CreatePost/>
                ,[...postList]]) : [...postList]}
              
                {/* <CreatePost/>
                {postList} */}
            </div>
        );
    }
    private postReference = firebase.database().ref('posts');

    
    componentDidMount() { // populates posts array state when component appears on screen (aka mounted)
        // callback triggered when data is changed/updated 
   
        this.postReference.on('value', (snapshot) => {
          // takes the data snapshot of the post reference
          let dataset= snapshot.val();
          let array :string[]= []
          // gets the keys of each post
          if (dataset != null) {
            array = Object.keys(dataset);
          }

          let postArray = array.map((key) => {
            
              console.log(key)
              console.log(this.state.postID)
              let post = dataset[key]; 
             
              if(!this.state.postID.includes(key))
              {
                this.state.postID.unshift(key);
              }

            
              // before we were doing
              // this.state.postID.unshift(key)
              
    
              return post;
          });
          
          // console.log("Setting state in did mount");
          console.log(postArray);
          console.log(this.state.postID)
          
          // updates the state with the newly created postArray
          this.setState({
            posts: postArray.reverse(),
            // postID: array
          })
          // Scope 1
        });

        // Scope 2
      }

      // removes callback because component isn't being used 
      componentWillUnmount() {
        this.postReference.off();
      }

}

function mapStateToProps(state: PopAppState) {
    return { 
        userID: state.currentUser
    }
  }
  
  function mapDispatchToProps(dispatch: any)  {
    return {  }    
  } 
  
  export default connect(mapStateToProps, mapDispatchToProps)(Feed);
  