
// Actions and their types
import { pages, changedFilter, changedPostID, User, Post, Comment} from "./types";
import firebase from 'firebase/app';
// import PostPage from "../components/postPage";

export enum actionIdentifier {
  SETCURRENTPAGE,
  UPDATEFILTERS,
  UPDATEPOSTID,
  UPDATECURRENTUSER,
  GETUSER,
  GETPOST,
  POSTCOMMENT,
  GETCOMMENT
  // TODO: Add another item to this list. Don't forget to add a comma on the previous line!
}

export interface setCurrentPageAction {
  type: actionIdentifier,
  payload: pages
};

export interface updateFiltersAction {
  type: actionIdentifier,
  payload: changedFilter
};

export interface updatePostIdAction {
  type: actionIdentifier,
  payload: changedPostID 
};

export interface updateCurrentUserAction {
  type: actionIdentifier,
  payload: string 
};

export interface getUserAction {
  type: actionIdentifier,
  payload: User 
};

export interface getPostAction {
  type: actionIdentifier,
  payload: Post 
};

export interface postCommentAction {
  type: actionIdentifier
};

export interface getCommentAction {
  type: actionIdentifier,
  payload: Comment[] 
};

// Action creators

export function setCurrentPage(page: pages) : setCurrentPageAction {
  return {
    type: actionIdentifier.SETCURRENTPAGE,
    payload: page
  }
};

export function updateFilters(filter: changedFilter) : updateFiltersAction {
  return {
    type: actionIdentifier.UPDATEFILTERS,
    payload: filter
  }
};

export function updatePostId(postID: changedPostID) : updatePostIdAction {
  return {
    type: actionIdentifier.UPDATEPOSTID,
    payload: postID 
  }
};

export function updateCurrentUser(currentID: string) : updateCurrentUserAction {
  return {
    type: actionIdentifier.UPDATECURRENTUSER,
    payload: currentID
  }
};

// TODO: trouble shoot the problem
export function getUser(userID: string) : getUserAction {
  // userID might not work right now
  let target = 'users/' + userID; 
  var reference = firebase.database().ref(target); 

  let dataset : User = {userID: userID, icon:""};
  reference.on('value', (snapshot) => {
    // takes the data snapshot of the post reference
    dataset = snapshot.val();
    // gets the data from users. 
  });
  return {
    type: actionIdentifier.GETUSER,
    payload: {userID: userID, icon:""}
  }
};

export function getPost(postID: string) : getPostAction {
  // userID might not work right now
  let target = 'posts/' + postID; 
  var reference = firebase.database().ref(target); 

  let post : Post = {
    authorID: "test",
    displayType: "experience",
    title: "post not found",
    topic: "test",
    options: {}
    };
  
  reference.on('value', (snapshot) => {
    // takes the data snapshot of the post reference
    let dataset : Post = snapshot.val();
    // gets the data from users. 
    post = dataset;
  });
  return {
    type: actionIdentifier.GETPOST,
    payload: post
  }
};

export function postComment(comment: Comment) : postCommentAction {
  firebase.database().ref('comments').push(comment);
  let post : Post = getPost(comment.postID).payload;
  if (comment.option) {
    post.options[comment.option] ++;
    firebase.database().ref('posts/' + comment.postID).set(post);
  }
  return {
    type: actionIdentifier.POSTCOMMENT
  }
};

export function getComments(postID: string, amount?: number, filtered: boolean = false) : getCommentAction {
  var reference = firebase.database().ref('comments'); 

  let comments: any[] = []

  reference.on('value', (snapshot) => {
    // takes the data snapshot of the post reference
    let dataset= snapshot.val();
    // gets the keys of each post
    let array = Object.keys(dataset);

    // filtering all comments to just comments related to post
    let postComment = array.filter((obj) => {
      if (filtered) {
        //add code for checking whether comments auther has the right background
        return dataset[obj].postID === postID
      } else {
        return dataset[obj].postID === postID
      }
    }).map((img) => { return dataset[img] });
    comments = postComment;
  });

  if (amount !== undefined) {
    comments =  comments.slice(0,amount);
  }
  return {
      type: actionIdentifier.GETCOMMENT,
      payload: comments
    }
};

export type PopActions = setCurrentPageAction | updateFiltersAction | updatePostIdAction | updateCurrentUserAction

