//@ts-nocheck
import React from "react";
import { Stack, IStackStyles, IStackTokens, IStackItemStyles, } from 'office-ui-fabric-react/lib/Stack';
import { connect } from "react-redux";
import { PopAppState, pages } from '../redux-data/types';
import profPic from '../assets/profPic.png'
import '../scss/profilePage.css'; 
import firebase from 'firebase/app';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';



interface signInState {
  email: string,
  password: string,
  repPassword: string,
  authError: string,
  age: string,
  male: boolean,
  female: boolean,
  nb: boolean,
  backgroundInfo: string[]
}

interface signInProps {
  updateCurrentUser: (currentID: string) => void,
  setCurrentPage: (page: pages) => void,
  userID: string
}

const useStyles = makeStyles((theme: Theme) =>
      reateStyles({
      root: {
      display: 'flex',
    },
    formControl: {
      margin: theme.spacing(3),
    },
  }),
);

 class ProfilePage extends React.Component<signInProps, signInState> {
  constructor(props:any) {
    super(props);
    //GRAB FIREBASE STUFF
    this.state = {
      email: "",
      password:"",
      authError: "",
      age: "",
      male: false,
      female: false,
      nb:false,
      backgroundInfo: []
    }
  } //end constructor

    async componentDidMount() {
        let user = firebase.auth().currentUser;
        let currentEmail = user.email;
        
        // current id
        let currentID = this.props.userID;
        console.log(currentID)

        let userObject = firebase.database().ref("users/" + currentID); 
        const snapshot = await userObject.once('value');
        if (!snapshot.exists()) {
            console.log("SnapShot doesn't exsist");
            return;
        } 
        let dataset = snapshot.val(); //takes value of "users"

        let backgroundArr = [];
        let currentAge = dataset.background.age;
        let aging = Object.keys(currentAge)[0];
        aging = aging.replace(aging[0], aging[0].toUpperCase());
        aging = aging.replace('To', ' - ')
        backgroundArr.push(aging);

        let maleBool = dataset.background.gender.male;
        if(maleBool) {
            backgroundArr.push("Male");
        }
        let femaleBool = dataset.background.gender.female;
        if(femaleBool) {
            backgroundArr.push("Female");
        }
        let nbBool = dataset.background.gender.nonbinary;
        if(nbBool) {
            backgroundArr.push("Non-binary");
        }

        this.setState({
            email: currentEmail,
            age: Object.keys(currentAge)[0],
            male: maleBool,
            female: femaleBool,
            nb: nbBool,
            backgroundInfo: backgroundArr
        });
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
      };
  
      CheckChange = (event:React.ChangeEvent<HTMLInputElement>) => {
        event.persist()
        this.setState({
          [event.target.name]: event.target.checked 
        });
      };
  
    cancel = (event:React.FormEvent<HTMLButtonElement>) => {
        this.props.setCurrentPage(pages.HomePage);
        event.preventDefault();
        this.setState({
            email: "",
            password: "",
            repPassword: "",
            age: "",
        
        });
    }
    

    render() {
        let backgroundInfo = this.state.backgroundInfo.map((info) => {
            return <li>{info}</li>
        })
        return (
            <div>
                <h1>Your Profile</h1>
                <div className="profileSplit">
                    <div>
                        <section className="email">
                            <h1>Email:</h1>
                            <input className="inputForm" placeholder={this.state.email} type="text" onChange={this.changeEmail}></input>
                        </section>
                        <section className="password">
                            <h1>Change Password:</h1>
                            <div className="inline">
                                <input className="inputForm" placeholder="enter password"type="text" onChange={this.changePassword}></input>
                                <input className="inputForm" placeholder="retype password"type="text" onChange={this.changerepPassword}></input>
                            </div>
                        </section>
                        <section className="background">
                            <h1>Background</h1>
                            <ul>
                                {backgroundInfo}
                            </ul>
                        </section>
                    </div>
                    <div>
                        <section className="displayIcon">
                            <h1>Display Icon:</h1>
                            <img src={profPic} alt="profile Picture" className="profPic"></img>
                        </section>
                        <section className="editBackground">
                            <h1>Edit Your Background:</h1>
                            <FormControl size="small" component="fieldset">
                      <FormLabel component="legend">Age Range</FormLabel>
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
                        </section>

                        <section>
                        <FormControl component="fieldset" className={useStyles.formControl}>
                        <FormLabel component="legend">Gender Identity</FormLabel>
                        <FormGroup>
                        <FormControlLabel control={<Checkbox color="primary" checked={this.state.male} onChange={this.CheckChange} name="male" />}label="Male"/>
                        <FormControlLabel control={<Checkbox color="primary" checked={this.state.female} onChange={this.CheckChange} name="female" />} label="Female"/>
                        <FormControlLabel control={<Checkbox color="primary" checked={this.state.nb} onChange={this.CheckChange} name="nb" />} label="Nonbinary"/>
                        </FormGroup>
                        </FormControl>
                          </section>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state: PopAppState) {
  return { 
      userID: state.currentUser
  }
}

function mapDispatchToProps(dispatch: any)  {
  return {
      setCurrentPage: (page: pages) => dispatch(setCurrentPage(page)),
      updateCurrentUser: (  currentID: string ) => dispatch(updateCurrentUser(currentID))
  }    
} 

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);