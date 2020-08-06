import React from "react";
import { connect } from "react-redux";
import {setCurrentPage } from "../redux-data/actions"
import { PopAppState, pages, Comment, changedPostID, Options } from "../redux-data/types";
import "../scss/Post.css";
import { updatePostId } from "../redux-data/actions"
import NarrowChart from "../components/NarrowChart";
import CommentFeed from "./CommentFeed";
import Reply from "./Reply";
import firebase from 'firebase/app';

interface postProps {
    postData: any;
    postIdentity: any;
    updatePostID: (postID: changedPostID) => void;
    setCurrentPage: (page: pages) => void;
}

interface postState {
    comments: Comment[]
}

class Post extends React.Component<postProps, postState> {
    constructor(props: postProps, state: postState){
        super(props);
        this.state = {comments: []};
        //console.log("In the post, here's the data");
        //console.log(this.props.postData)

      }
      

    render() {
        return (
            <div key= {this.props.postIdentity} id="postStretch" >
                <h2 onClick={this.changePage}>{this.props.postData.title}</h2>
                {this.renderMore()}
                <CommentFeed commentArray = {this.state.comments} postOptions={this.props.postData.options}/>
                <Reply postID = {this.props.postIdentity} />
            </div>
        );
    }
    componentDidMount() {
        this.getComments(2);
    }

    getComments = (amount: number, filtered: boolean = false) => {
        var reference = firebase.database().ref('comments'); 

        reference.on('value', (snapshot) => {
            // takes the data snapshot of the post reference
            let dataset= snapshot.val();
            // gets the keys of each post
            let array = Object.keys(dataset);

            // filtering all comments to just comments related to post
            let postComment = array.filter((obj) => {
            if (filtered) {
                //add code for checking whether comments auther has the right background
                return dataset[obj].postID === this.props.postIdentity
            } else {
                return dataset[obj].postID === this.props.postIdentity
            }
            }).map((img) => { return dataset[img] });
            if (amount !== undefined) {
                postComment =  postComment.slice(0,amount);
            }

            this.setState({comments: postComment});

        });
      };


    private changePage = () => {
        this.props.setCurrentPage(pages.PostPage);
        this.props.updatePostID(this.props.postIdentity)
    }
    private renderMore(): any 
    {
        switch(this.props.postData.displayType)
        {
            case "freeResponse": {
                return("");
            }
            case "thisOrThat":
            case "poll": {
                //console.log(this.props.postData);
                //console.log(this.props.postData.options);
                let options: Options = this.props.postData.options;
                if (options !== undefined) {
                    const data = Object.entries(options).map(([option, total]:[string,number]) => ({
                        "name": option,
                        "data": total
                        }));
                    // console.log("this is data passed to narrowChart");
                    // console.log(data)
                    return (
                        <div>  
                        <NarrowChart data={data}/>
                        </div> 
                    );
                }
                return "";
            }
        }
    }
} 

function mapStateToProps(state: PopAppState) {
    return { }
}

function mapDispatchToProps(dispatch: any)  {
    return {
        setCurrentPage: (page: pages) => dispatch(setCurrentPage(page)), 
        updatePostID: ( postID: changedPostID ) => dispatch(updatePostId(postID))
    }    
}
  
  export default connect(mapStateToProps, mapDispatchToProps)(Post);
