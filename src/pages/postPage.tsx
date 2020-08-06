// post page component
// takes in prop of EITHEr
// - postID to call in firebase
// - entire post object 
// will decide later 

import React from "react";
import firebase from 'firebase/app';
import D3Chart from "../components/BarChart";
import FilterBox from "../components/FilterBox";
import "../scss/PostPage.css";
import { connect } from "react-redux";
import { PopAppState, Filters, graphData, Post } from "../redux-data/types";
import CommentFeed from "../components/CommentFeed";

// defines the states of PostPage
interface postStates {
    content: any,
    id: any,
    comments: any[],    
}

// defines the states of PostPage
interface postProps {
    id: string,
    filter: Filters
    // will take in post data!! to fill in state content
}

class PostPage extends React.Component<postProps, postStates> {
    constructor(props: postProps, state: postStates){
        super(props, state);
        this.state = {
            content: {},
            id: "",
            comments: []
        };
        this.filterPost();
      }

    // makes request to firebase to get posts dataset
    private target = 'posts/' + this.props.id
    private postReference = firebase.database().ref(this.target); 
    
    async componentDidMount() { 
      // callback triggered when data is changed/updated 
      this.postReference.on('value', (snapshot) => {
        // takes the data snapshot of the post reference
        let dataset = snapshot.val();
        this.setState({
            content: dataset,
            id: this.props.id
        })
      });
      if (this.state.content.displayType === "poll" || this.state.content.displayType === "thisOrThat") {
        await this.filterPost();
      }
    }

    // removes callback because component isn't being used 
    componentWillUnmount() {
      this.postReference.off();
    }

    async componentDidUpdate(prevProps: postProps) {
      if (this.state.content.displayType === "poll" || this.state.content.displayType === "thisOrThat") {
        if (this.props.filter !== prevProps.filter) {
            await this.filterPost();          
        }
      }
    }

    private renderMore(): any 
    {
      let graphData = this.formattedGraphData();
      if(this.state.content.displayType === "poll" || this.state.content.displayType === "thisOrThat")
      {
        return (
          <div className="graphContent">
                <span id = "graph" ><D3Chart data={graphData} postOptions={this.state.content.options}/></span>
                <span id = "filters" ><FilterBox /></span>
          </div>
        )
      }
    }
    
    render() {
      //let graphData = this.formattedGraphData();
        return (
        <div className="expandedPost" id="centerContent">
            <h1 id="postHeading">{this.state.content.title}</h1>
            {this.renderMore()}
            <h2 id="commentsHeading"> Comments</h2>
            <CommentFeed commentArray={this.state.comments} postOptions={this.state.content.options}/>
        </div>
        );
    }

    // taking this.state.data and formatting for graph
    formattedGraphData() {
      let comments = this.state.comments;
      let countArr : graphData[]  = [];

      // iterates through each comment and tallies up their poll votes 
      comments.forEach((comment) => {
        let option = comment.option;
        
        // tells function if the category doesn't exist
        // true = no, so will add new object
        // false = already exists and vote has been tallied. 
        let addCategory = true;

        // iterate through each existing category
        for (let i in countArr) {
          if (option === countArr[i].name) { // if the category already exists, increase data by 1 
            // console.log("Adding to existing category");
            let updateData = countArr[i].data + 1;
            countArr[i].data = updateData;
            addCategory = false;
          } 
        }

        // if the category doesn't already exist, add a new object 
        if(addCategory) {
          // console.log("category is not present in array yet")
          let object = {
            "name": comment.option,
            "data": 1
          };
          countArr.push(object);
        }
      })
      return countArr;
    }

    // filters the comments using filterBox
    async filterPost() {
      var reference = firebase.database().ref('comments'); 
      let userCheck: string[] = [];

      const dataSnapshot = await reference.once('value');
      // takes the data snapshot of the post reference
      let allComments = dataSnapshot.val();
      // gets the keys of each post
      let array = Object.keys(allComments);

      // filtering all comments to just comments related to post
      let postComment = array.filter((obj) => {
        // single comment's postID 
        let commentPostID = allComments[obj].postID;
        // filtering done here. checks if the single comment postID equals the page's postID 
        if(commentPostID === this.state.id) {
          return true;
        } else {
          return false;
        } //the comments are below where the users are chosen
      }).map(function(user) { 
        // making list of users who wrote the comment
        userCheck.push(allComments[user].authorID) // u can leave out map. also im focused now. i was eating the sandwhich. om nom nom
        return allComments[user] 
      });

      // // filtering with user demographics... a work in progress
      let selectedUser: any[] = [];

      var userDemo = firebase.database().ref("users"); //GO THROUGH ALL THE USERS
      
      const snapshot = await userDemo.once('value');

      if (!snapshot.exists()) {
        console.log("SnapShot doesn't exsist");
        return;
      }
        
      let dataset = snapshot.val(); //takes value of "users"
      
      // console.log(this.props.filter);
      let filters = this.props.filter; // GENERIC FILTERS DICTATED ON PAGE CHECKBOXES

      let filterID = Object.keys(filters); // GO THROUGH FILTER GROUPS (IE: AGE AND GENDER)
      let filterCount = filterID.length;

        // only going through the users that wrote the comment
      userCheck.forEach((user) => { // THE OFFICIAL START OF THE MADNESSS
        let userData = dataset[user]; // LOOKS SPECFICALLY AT SELECTED USER'S DATA 
        // looking at their background to identify if user meets the filter criteria 
        let userBackground = userData.background; // USER'S background object age and gender
        
        //counter is to check if they meet both gender as well age criterias
        let counter = 0;

        filterID.forEach((filter) => { // PT 2 OF FILTERING MADNESS STARTS HERE  GOIN THROUGH AGE... AND THEN GENDER... 
          let userFilter = userBackground[filter]; // GET USERS AGE OBJECT
          let stateFilter = filters[filter].value; // GET CHECKBOXES AGE OBJECT
          
          let filterObjects = Object.keys(stateFilter); 

          // determining which filters we need to check
          let importantFilters = filterObjects.filter((f) => {
            if(stateFilter[f].value === true) {
              return true;
            } else {
              return false;
            }
          })
            
          if (importantFilters.length === 0) { // filter not needed to be considered
            // console.log("No filters to consider");
            counter += 1;
          } else {
            // COMPARING CHECKBOX FILTERS TO USER FILTERS 
            // IF ONE OF USER FILTERS MATCHES CHECKBOX (sFilter) FILTERS, ADD 1 TO COUNTER
            let userKeys = Object.keys(userFilter);

            // NESTED LOOP TO COMPARE ALL FILTERS TO ALL OF USER SELECTION
            importantFilters.forEach((sFilter) => {
              userKeys.forEach((uFilter) => {
                // checking if the user filter is true
                let userFilterBoolean = userFilter[uFilter];
                // checking if the user filter and checkbox filter are 
                if((sFilter === uFilter) && (userFilterBoolean)) {
                //  console.log("SUCESS! " + uFilter + " matches " + sFilter + " and added 1 to counter");
                  counter += 1;
                } else {
                }
              })
            })
          }
          
          // take users who meet criteria and have counter who meets at least 1 from each of the filter groups
          if (counter >= filterCount) {
            selectedUser.push(user);
          }
        })
      })
    
      //filtered data comes from postComment which are COMMENTS that are related to a specific postID
      let officalComments = postComment.filter((comment) => {
        let author = comment.authorID;
        if(selectedUser.includes(author) ) {
          return true 
        } else {  
          return false
        }
      });
      
      // updates the state
      this.setState((state, props) => ({
        comments: officalComments,
      }));
    }
}

function mapStateToProps(state: PopAppState) {
  return { 
    id: state.clickedPostID,
    filter: state.currentFilters
  }
}
// is it still connecteds
function mapDispatchToProps(dispatch: any)  {
  return {
  }    
}

export default connect(mapStateToProps, mapDispatchToProps)(PostPage);