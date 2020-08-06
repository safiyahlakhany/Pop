import React from 'react'; 
import '../scss/CommentFeed.css'; 
import { PopAppState, Comment } from '../redux-data/types';
import { connect } from 'react-redux';
import CommentBox from './CommentBox'


interface CommentFeedProps {
    commentArray: Comment[],
    postOptions: any 
}

class CommentFeed extends React.Component<CommentFeedProps>  {
    
    render() {
      return (
        <div>
          {this.props.commentArray.map((value, index) => {
            return <CommentBox comment={value} postOptions={this.props.postOptions}/>
          })}
        </div>
      );
    }
  }

  function mapStateToProps(state: PopAppState) {
    return { currentFilters: state.currentFilters}
  }
  
  function mapDispatchToProps(dispatch: any) {
    return {
    }
  }
  
  export default connect(mapStateToProps, mapDispatchToProps)(CommentFeed);