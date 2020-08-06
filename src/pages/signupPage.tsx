// @ts-nocheck
//welcome to my liveshares
import React from "react";
import { Stack, IStackStyles, IStackTokens, IStackItemStyles, StackItem } from 'office-ui-fabric-react/lib/Stack';
import { setCurrentPage, updateCurrentUser } from '../redux-data/actions';
import { connect } from "react-redux";
import { PopAppState, pages,} from '../redux-data/types';

import 'firebase/database';
import * as firebase from 'firebase/app';
import "firebase/auth";

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

import banner from "../assets/BubblesBanner.png";
import '../scss/signupPage.css'; 

// Styles definition
const stackStyles: IStackStyles = {
    root: {
      backgroundColor: '#BADEF8',
      display: 'flex',
      width: 'inherit',
      height: 'inherit',
      justifySelf: 'center',
      alignSelf: 'center',
      borderRadius: '80px'
    },
  };
  const stackItemStyles: IStackItemStyles = {
    root: {
    //   background: DefaultPalette.themePrimary,
      color: 'black',
      padding: 5,
      fontFamily: 'Montserrat',
      display: 'flex',
      width:'inherit',
      //justifyContent: 'space-around',
    },
  };
  
  // Tokens definition for stack FluentUI component
  const containerStackTokens: IStackTokens = { childrenGap: 5 };
  // const verticalGapStackTokens: IStackTokens = {
  //   childrenGap: 10,
  //   padding: 10,
  // };
  const itemAlignmentsStackTokens: IStackTokens = {
    childrenGap: 5,
    padding: 10,
  };
  
//for the checkboxes for gender identity
  const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    formControl: {
      margin: theme.spacing(3),
    },
  }),
);


//end checkbox reqs
  
interface SignupPageState {
  email: string,
  password: string,
  repPassword:string,
  age: string, //ex : "underTwelve"
  male: boolean,
  female:boolean,
  nb:boolean, //multiple identities for checkbox.
  authError: string, //used for firebase errors
  
}

interface SignupPageProps {
  updateCurrentUser: (currentID: string) => void,
  setCurrentPage: (page: pages) => void 
}

class SignupPage extends React.Component<SignupPageProps,SignupPageState> {
    constructor(props:any) {
      super(props);

      this.state = {
        email: "",
        password:"",
        repPassword: "",
        age: "",
        male: false, //initially want to have the checkboxes unchecked, so false
        female: false,
        nb:false,
        authError: ""
      }
    } 

    // updating email state as user types in email text box
    changeEmail = (event:React.ChangeEvent<HTMLInputElement>) => {
      this.setState({
       email: event.target.value
      }); 
    };

    // updating password state as user types in password text box
    changePassword = (event:React.ChangeEvent<HTMLInputElement>) => {
      this.setState({
        password: event.target.value
      });
    };

    // updating 2nd password state as user types in 2nd password text box
    changerepPassword = (event:React.ChangeEvent<HTMLInputElement>) => {
      this.setState({
        repPassword: event.target.value
      });
    };

    // updating age state as user selects a radio button
    handleChange = (event:React.ChangeEvent<HTMLInputElement>) => {
      this.setState({
        age: event.target.value
      })
    }

    // when pop is clicked, we will check if passwords match and if email is legit
    // if it's all good, will be taken to signup function (below)
    // if not, message will show up 
    private onSubmit = (event:React.FormEvent<HTMLButtonElement>) => {
      //event.preventDefault();
      if (this.password !== this.repPassword) {
        this.setState({
          authError: "Passwords don't match"
        })
      } else {
        firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {
        this.signUp();
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        if(errorCode) {
          this.setState({
            email: "",
            password: "",
            repPassword: "",
            authError: errorMessage
          })
        }
      });
      }
    }    

    // when user is able to create user with email and password, we sign them up
    // sets redux current user, switches page, and adds user to firebase 
    private signUp = () => {
      let updateUser = this.props.updateCurrentUser;
      let switchPage = this.props.setCurrentPage;
      let addUser = this.addUserToFirebase;
      
        firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            // User is signed in
            var uid = user.uid;
            
            updateUser(uid);
            switchPage(pages.HomePage);
            //add's users info to firebase 'users' object 
            addUser(uid);
          } 
        });
    }
    
    // adding new user 'stuff'(not auth) to firebase 
    private addUserToFirebase = (uid: string) => {
      let aged = this.state.age; //we use this string (from the radio values) to match the filter name
      let user = uid;
      let isMale = this.state.male; //bools
      let isFemale = this.state.female;//bool
      let isNonbinary = this.state.nb;//bool
      
        let newUser = {
          background: {
            age:  {[aged]: true} , //[aged]: true should map to something like underTwelve:true
            gender: {male: isMale, female:isFemale ,nonbinary: isNonbinary},
          }
        };

      firebase.database().ref("users").child(user).set(newUser);  
    }

    private cancel = (event:React.FormEvent<HTMLButtonElement>) =>
    {
      this.props.setCurrentPage(pages.WelcomePage);
      event.preventDefault();
      this.setState({
        email: "",
        password: "",
        repPassword: "",
        age: "",
      
      });

    };
    // const CheckChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //   setState({ ...state, [event.target.name]: event.target.checked });
    // };
  //CheckChange handles state changes of gender demographics with checkboxes
    CheckChange = (event:React.ChangeEvent<HTMLInputElement>) => {
      event.persist()
      this.setState({
        [event.target.name]: event.target.checked 
      });
    };

    handleKeyPress = (event) => {
      if(event.key === 'Enter'){
        this.onSubmit();
      }
    }


    render() {
        return (
          <div>
            <h1>Just a few details to get you started...</h1>
            <div id="blueWrapper"> 
              <div id="inputFieldsWrapper">
                <span id="inputHeading">Email:</span>
                <input className="inputField"type="text" placeholder="popyourbubble@pop.com" value={this.state.email} onChange={this.changeEmail} id="upInput"></input>
                
                <span id="inputHeading">Password:</span>
                <input className="inputField"type="password" placeholder="Enter Password" value={this.state.password} onChange={this.changePassword} id="upInput"></input>
                
                <span id="inputHeading">Repeat Password:</span>
                <input className="inputField"type="password" placeholder="Enter Password" value={this.state.repPassword} onKeyDown={this.handleKeyPress} onChange={this.changerepPassword} id="upInput"></input>
                  
              </div>
                <div id="checkFieldsWrapper">
                <span id="inputHeading">Age Range:</span>
                <FormControl size="small" component="fieldset">
                {/* <FormLabel component="legend">Age Range</FormLabel> */}
                  <RadioGroup aria-label="Age Range" name="Age" value={this.state.age} onChange={this.handleChange}>
                    <FormControlLabel value="underTwelve" control={<Radio color="primary" />} label="Under 12" />
                    <FormControlLabel value="twelveToSeventeen" control={<Radio color="primary"/>} label="12 - 17" />
                    <FormControlLabel value="eighteenToTwentyfour" control={<Radio color="primary"/>} label="18 - 24" />
                    <FormControlLabel value="twentyfiveToThirtyfour" control={<Radio color="primary"/>} label="25 - 34"/>
                    <FormControlLabel value="thirtyfiveToFortyfour" control={<Radio color="primary"/>} label="35 - 44" />
                    <FormControlLabel value="fortyfiveToFiftyfour" control={<Radio color="primary"/>} label="45 - 54" />
                    <FormControlLabel value="fiftyfiveToSixtyfour" control={<Radio color="primary"/>} label="55 - 64" />
                    <FormControlLabel value="sixtyfiveToSeventyfour" control={<Radio color="primary"/>} label="65 - 74" />
                    <FormControlLabel value="seventyfiveOrOlder" control={<Radio color="primary"/>} label="75+" />
                  </RadioGroup>
                </FormControl>

                <span id="inputHeading">Gender Identity:</span>
                  <FormControl component="fieldset" className={useStyles.formControl}>
                  <FormGroup>
                  <FormControlLabel control={<Checkbox color="primary" checked={this.state.male} onChange={this.CheckChange} name="male" />}label="Male"/>
                  <FormControlLabel control={<Checkbox color="primary" checked={this.state.female} onChange={this.CheckChange} name="female" />} label="Female"/>
                  <FormControlLabel control={<Checkbox color="primary" checked={this.state.nb} onChange={this.CheckChange} name="nb" />} label="Nonbinary"/>
                  </FormGroup>
                </FormControl>
                </div>
            </div>
            <p className="errorLabel"> {this.state.authError} </p>
            <div id="submitButtons">
                  <button className="popButton" id="submitButton" onKeyDown={this.handleKeyPress} onClick={this.onSubmit}>POP</button>
                  <button className="popButton" id="submitButton" onClick={this.cancel}>Cancel</button>
                </div>
            <img src={banner} style={{width: "1400px", bottom: '10px', paddingTop: '10px'}}/>
        
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

export default connect(mapStateToProps, mapDispatchToProps)(SignupPage);

  