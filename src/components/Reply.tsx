import React from 'react'; 
import { PopAppState, Comment, Post } from '../redux-data/types';
import { connect } from 'react-redux';
import {postComment, getPost, getPostAction} from "../redux-data/actions";
import "../scss/Reply.css";

interface ReplyProps {
  postID: string,
  currentUser: string,
  postComment: (c: Comment) => void,
  getPost: (id: string) => getPostAction
}

interface ReplyState {
    commentText: string,
    option: string
}

const colorArray = ["darkBlueSubmit", "lightBlueSubmit","redSubmit"];

class Reply extends React.Component<ReplyProps, ReplyState>  {
    constructor(props: ReplyProps){
      super(props);
      this.state = {commentText:'', option: ' '}
    }
  
    //when the text in the form changes
    updateComment = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      this.setState({
        commentText: event.target.value
      });
    }

    //post a new chirp to the database
    addComment = (event:  any) => {
      event.preventDefault(); //don't submit
      
      // TODO: ERROR HERE BC THIS.PROPS.CURRENTUSER gives back object for some reason.

      // defines new object to add to firebase 
      let newComment : Comment = {
        authorID: this.props.currentUser,
        postID: this.props.postID,
        textContent: this.state.commentText
      }

      if (event.target.name !== undefined) {
        newComment.option = event.target.name;
      }
      // adding the new post to firebase database, sepcifcally to the posts
      this.props.postComment(newComment);
  
      // empties out post for next time 
      this.setState({commentText:''}); 
    }

    private button(): any {
      let post: Post = this.props.getPost(this.props.postID).payload;
      
      // hmmm why is post null 
      if (!(post && post.options)) {
        return( <input type="submit" value ="Submit"
        onClick={this.addComment} className="replySubmit" id="submitVal"
        />)
      } else {
        let index:number = -1;
        if(Object.entries(post.options).length === 2)
        {
          index += 1;

        }
        
        return(Object.entries(post.options).reverse().map(([option, count]:[string,number]) => {
          index +=1;
          return (<input type="submit" value = {option} name = {option}
                  onClick={this.addComment}
                  id={colorArray[index]} className="replySubmit"
                  />); 
        } ))
      };
      
    };
  
    render() {
      // console.log("in reply")
      // console.log(this.props.postID)
      // post ID is undefined... this is causing an error
      // let post: Post = this.props.getPost(this.props.postID).payload;
      // let button;
      // // hmmm why is post null 
      // if (!(post && post.options)) {
      //   button = <input type="submit" value ="Submit"
      //   onClick={this.addComment} className="replySubmit" id="submitVal"
      //   />;
      // } else {
      //   // for input, took opur className="form-control mb-2"
        
      //   // console.log("thats the options length")
      //   // let index:number = -1;
      //   // if(Object.entries(post.options).length === 2)
      //   // {
      //   //   index += 1;

      //   // }
      //   // private button(): any {
      //   //   Object.entries(post.options).reverse().map(([option, count]:[string,number]) => {
      //   //   index +=1;
      //   //   return (<input type="submit" value = {option} name = {option}
      //   //           onClick={this.addComment}
      //   //           id={colorArray[index]} className="replySubmit"
      //   //           />); 
      //   //         } )};
      //   // };
  
      return (
        
        <div id="replyForm">
          {this.props.currentUser !== "" ? (<form onSubmit={this.addComment} id="replyForm">
                  {/* <input name="text" placeholder="Add comments here" 
                  value={this.state.commentText} 
                  onChange={this.updateComment}
                  className="replyInput"
                  /> */}
                  <textarea
                  name="text" placeholder="Add comments here" 
                  value={this.state.commentText} 
                  onChange={this.updateComment}
                  className="replyInput"
                  />
                {this.button()}
              </form>) : "Sign in to comment"}
              
        </div>
      );
    }
  }

  function mapStateToProps(state: PopAppState) {
    return { 
      currentUser: state.currentUser
    }
  }
  
  function mapDispatchToProps(dispatch: any) {
    return {
      postComment: (c: Comment) => dispatch(postComment(c)),
      getPost: (id: string) => dispatch(getPost(id))
    }
  }
  
  export default connect(mapStateToProps, mapDispatchToProps)(Reply);