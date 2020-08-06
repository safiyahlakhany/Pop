//@ts-nocheck
import React from "react";
import { Stack, IStackStyles, IStackTokens, IStackItemStyles, } from 'office-ui-fabric-react/lib/Stack';
import { connect } from "react-redux";
import { PopAppState, pages } from '../redux-data/types';

import 'firebase/database';
import * as firebase from 'firebase/app';
import "firebase/auth";

import '../scss/signupPage.css'; 
import { updateCurrentUser, setCurrentPage } from "../redux-data/actions";

import banner from "../assets/BubblesBanner.png";

interface signInState {
  email: string,
  password: string,
  authError: string
}

interface signInProps {
  updateCurrentUser: (currentID: string) => void,
  setCurrentPage: (page: pages) => void
}

//for the checkbox
// const inputProps: ICheckboxProps['inputProps'] = {
//     onFocus: () => console.log('Checkbox is focused'),
//     onBlur: () => console.log('Checkbox is blurred'),
//   };


// Styles definition
const stackStyles: IStackStyles = {
    root: {
      backgroundColor: '#BADEF8',
      width: '33vw',
      height: 'inherit',
      display: 'flex',
      justifySelf: 'center',
      alignSelf: 'center',
      borderRadius: '80px',
      

    },
  };
  const stackItemInputStyles: IStackItemStyles = {
    root: {
    //   background: DefaultPalette.themePrimary,
      color: 'black',
      padding: "20px",
      paddingTop: "0px",
      fontFamily: 'Montserrat',
      display: 'flex',
      //justifyContent: 'space-around',
    },
  };
  
  const stackItemStyles: IStackItemStyles = {
    root: {
    //   background: DefaultPalette.themePrimary,
      color: 'black',
      padding: "20px",
      paddingBottom: "0px",
      fontFamily: 'Montserrat',
      display: 'flex',
      //justifyContent: 'space-around',
    },
  };

  // Tokens definition
  const containerStackTokens: IStackTokens = { childrenGap: 5 };
  const verticalGapStackTokens: IStackTokens = {
    childrenGap: 10,
    padding: 10,
  };
  const itemAlignmentsStackTokens: IStackTokens = {
    childrenGap: 5,
    padding: 10,
  };
  const clickableStackTokens: IStackTokens = {
    padding: 10,
  };


 class SignInPage extends React.Component<signInProps, signInState> {
  constructor(props:any) {
    super(props);

    this.state = {
      email: "",
      password:"",
      authError: ""
    }

  } //end constructor


  private onSubmit = (event:React.FormEvent<HTMLButtonElement>) => { //React.FormEvent<HTMLButtonElement>
    firebase.auth().signOut();
    //event.preventDefault();
    var myauthError = "";
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
    .then(() => {
      this.signIn();
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      if(errorCode) {
        this.setState({
          email: "",
          password: "",
          authError: errorMessage
        })
      }
    });
  }
 
  private signIn = () => { 
      let updateUser = this.props.updateCurrentUser;
      let switchPage = this.props.setCurrentPage; 
      firebase.auth().onAuthStateChanged(function(user) { 
        if (user) {
          // User is signed in and add to redux 
          var uid = user.uid;
          updateUser(uid);
          switchPage(pages.HomePage)
        } 
      });     
  }

  changeEmail = (event:React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
     email: event.target.value
    }); 
  };

  changePassword = (event:React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      password: event.target.value
    });
  };

  handleKeyPress = (event:React.KeyboardEvent) => {
    if(event.key === 'Enter'){
      this.onSubmit();
    }
  }

    render() {
        return (
            <div>
                <h1>Welcome Back!</h1>
            <Stack horizontalAlign="baseline" tokens={containerStackTokens}>
                <Stack styles={stackStyles} verticalAlign="center" tokens={itemAlignmentsStackTokens}>
                <Stack.Item align="start" styles={stackItemStyles}>
                    <span style={{paddingLeft: '5vw'}}>Email: </span>
                </Stack.Item>
                <Stack.Item align="center" styles={stackItemInputStyles}>
                    <input className="inputField"type="text" placeholder="popyourbubble@pop.com" onChange={this.changeEmail} value={this.state.email} style={{width: '18vw'}}></input>
                </Stack.Item>
                    
                <Stack.Item align="start" styles={stackItemStyles}>
                    <span style={{paddingLeft: '5vw'}}>Password: </span>
                </Stack.Item>

                <Stack.Item align="center" styles={stackItemInputStyles}>
                    <input className="inputField"type="password" placeholder="Enter Password" onKeyDown={this.handleKeyPress} onChange={this.changePassword} value={this.state.password} style={{width: '18vw'}}></input>
                </Stack.Item>

                <Stack.Item align="center">
                    <Stack horizontalAlign="end">
                      <p className="errorLabel"> {this.state.authError}</p>
                    </Stack>
                </Stack.Item>

                <Stack.Item align="center">
                    <Stack horizontalAlign="end">
                      <button className="popButton" onClick={this.onSubmit} style={{marginBottom: "30px"}}> POP</button>
                    </Stack>
                </Stack.Item>
                
                </Stack>
             </Stack>  
             <img src={banner} style={{width: "1400px", bottom: '10px', paddingTop: '40px'}}/>
             

            </div>

        );
    }
}

function mapStateToProps(state: PopAppState) {
  return { 
  }
}

function mapDispatchToProps(dispatch: any)  {
  return {
      setCurrentPage: (page: pages) => dispatch(setCurrentPage(page)),
      updateCurrentUser: (  currentID: string ) => dispatch(updateCurrentUser(currentID))
  }    
} 

export default connect(mapStateToProps, mapDispatchToProps)(SignInPage);