import React from 'react'; 
import '../scss/CommentBox.css'; 
import { PopAppState, Comment, User } from '../redux-data/types';
import { connect } from 'react-redux';
import { getUser } from '../redux-data/actions';
import profPic from "../assets/profPic.png";
import Option1ProfPic from "../assets/Option1ProfPic.png";
import Option2ProfPic from "../assets/Option2ProfPic.png";
import Option3ProfPic from "../assets/Option3ProfPic.png";
import "../scss/Post.css";
import { SelectableOptionMenuItemType } from 'office-ui-fabric-react';

interface CommentBoxProps {
    comment: Comment; 
    getUser: (id: string) => User;
    postOptions: any;
}


class CommentBox extends React.Component<CommentBoxProps>  {
  
  constructor(props:any){
    super(props);
    if(this.props.postOptions){
      Object.entries(this.props.postOptions).map((item) =>
      {
        let pushItem = (item[0])
        this.myArray.unshift(pushItem)
      });
    }


  }

    private myArray:Array<string> =[];
    
    
    render() {
        // if(this.props.postOptions){
        //   Object.entries(this.props.postOptions).map((item) =>
        //   {
        //     let pushItem = (item[0])
        //     this.myArray.unshift(pushItem)
        //   });
        // }
      if(this.props.comment.textContent != "")  
      {
      return (
        <div className="wrapper">
        <div className="comment-box">
   
          <div className="logo-div">
            {this.renderProfPic()}
          </div>
          <div className="content-div">
            <div className="option">{this.props.comment.textContent}</div>
          </div>
        </div>
        </div>
      );
      }
      else
      {
        return null;
      }
    }

    private renderProfPic(): any 
    {
      let correctProfPic =profPic
      if(this.myArray.length === 2)
      {
        switch(String(this.props.comment.option))
        {
          case String(this.myArray[0]): {
            correctProfPic = Option2ProfPic
            break;
          };
          case String(this.myArray[1]): {
            correctProfPic = Option3ProfPic
            break;
          };
        }

      }
      else if (this.myArray.length === 3)
      {
        switch(String(this.props.comment.option))
        {
          case String(this.myArray[0]): {
            correctProfPic = Option1ProfPic
            break;
          };
          case String(this.myArray[1]): {
            correctProfPic = Option2ProfPic
            break;
          };
          case String(this.myArray[2]): {
            correctProfPic = Option3ProfPic
            break;
          };
        }

      }
      return(<img className='userIcon' alt="user icon" src={correctProfPic}/>)

    }
  }


  


  function mapStateToProps(state: PopAppState) {
    return {currentUser: state.currentUser}
  }
  
  function mapDispatchToProps(dispatch: any) {
    return {
        getUser: (id: string) => dispatch(getUser(id))
    }
  }
  
  export default connect(mapStateToProps, mapDispatchToProps)(CommentBox);








