import React from "react";
import "../scss/Post.css";
import CPImage from "../assets/CreatePost.png";
import { Dropdown, IDropdownStyles, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { createTheme, Customizations } from 'office-ui-fabric-react';
import { TextField, ITextFieldStyles } from 'office-ui-fabric-react/lib/TextField';
import 'firebase/database';
import firebase from 'firebase/app';
import { Post, Options } from "../redux-data/types";

interface createPostState {
    postType: string,
    postQuestion: string,
    postTags: string,
    options: string[],
    currentUserID: string,

} 
const theme = createTheme({
    // You can also modify certain other properties such as fontWeight if desired
    defaultFontStyle: { fontFamily: 'Montserrat', fontSize:"20px", fontWeight: "700",  }
  });


  Customizations.applySettings({ theme });


const dropdownStyles: Partial<IDropdownStyles> = {
  dropdown: { width: 450, backgroundColor: "#5799EE", color: "#5799EE", borderWidth: "0px", borderRadius: "10px", marginBottom:"30px" },
  dropdownItem: {backgroundColor: "#5799EE", color: "white"},
  title: {backgroundColor: "#5799EE", color: "white", borderWidth: "0px", borderRadius: "10px"},
  caretDown: {color: "white"},
  dropdownItemSelected: {backgroundColor: "#5799EE"},
  label: {backgroundColor: "#5799EE", color: "white"},

  
};
const textFieldStyles: Partial<ITextFieldStyles> = { fieldGroup: { width: 450, height: 100, margin:"8px", alignSelf:"center", 
borderWidth: "0px", borderRadius: "10px", backgroundColor:"#EBEBEB" } };
const secondTextField: Partial<ITextFieldStyles> = { fieldGroup: { width: 450, margin:"8px", alignSelf:"center", 
borderWidth: "0px", borderRadius: "10px", backgroundColor:"rgba(186, 222, 248, 0.5)" } };
const thirdTextField: Partial<ITextFieldStyles> = { fieldGroup: { width: 450, margin:"8px", alignSelf:"center", 
borderWidth: "0px", borderRadius: "10px", backgroundColor:"rgba(237, 122, 112, 0.5)" } };

const dropdownOptions: IDropdownOption[] = [
  { key: 'freeResponse', text: 'What\'s your experience with..' },
  { key: 'poll', text: 'Do you support..' },
  { key: 'thisOrThat', text: 'This or That? Which do you think is.. '},
];


export class CreatePost extends React.Component<{}, createPostState> {
    constructor(props: any) {
        super(props);
        this.state = {
            postType: "freeResponse",
            postQuestion: "",
            postTags: "",
            options: [],
            currentUserID: "",
          
        };
       
    }
    onOptionChange = (event: any, index: number): void => {
        let newOptions = [...this.state.options];
        newOptions[index] = event.target.value;
        this.setState({options: newOptions});
    }


    onDropChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption): void => {
        this.setState({
            postType: (option === undefined) ? "" : String(option.key)
        });

        switch((option === undefined) ? "" : String(option.key))
        {
            case "poll": {
                this.setState({
                    options: ["Yes", "Unsure", "No"]
                });
                break;
            }
            case "freeResponse":
            case "thisOrThat": {
                this.setState({
                    options: []
                }); 
                break;
            }
        }
       
    }
    onContentChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string): void => {
        this.setState({
            postQuestion: String(newValue)
        });
    }
    onTagsChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string): void => {
        this.setState({
            postTags: String(newValue)
        });
    }
    

    render() {
        return (
            <div id="wrapper">
            <div id="postStretch">
                <div id="logo-div">
                    <img src={CPImage} alt="generic user img"></img>
                </div>
                <div id="content-div">
                    <h2>Ask a Question</h2>
                    <Dropdown
                        placeholder="What is your experience with..."
                        options={dropdownOptions}
                        styles={dropdownStyles}
                        onChange={this.onDropChange}
                    />
                    
                <TextField multiline resizable={false} styles={textFieldStyles} onChange={this.onContentChange} value={this.state.postQuestion} placeholder="Complete the prompt!"/>
                {this.renderAdditionalOptions()}
                <TextField resizable={false} styles={secondTextField} onChange={this.onTagsChange} value={this.state.postTags} placeholder="tags"/>
                <button onClick={this.onButtonPost} id="post-button"> Post </button>
                </div>
            </div>
            </div>
        );
    }

    private renderAdditionalOptions(): any {
        if(this.state.postType === "thisOrThat")
        {
            return (
             <div>
             <TextField resizable={false} styles={thirdTextField} value={this.state.options[0]} placeholder="This" onChange={(e) => {this.onOptionChange(e, 0)}}/>
             <TextField resizable={false} styles={thirdTextField} value={this.state.options[1]} placeholder="That" onChange={(e) => {this.onOptionChange(e, 1)}}/>
             </div>
            );
        }
    }


    private onButtonPost = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        let newTitle : string = this.state.postQuestion;
        let newOptions : Options = {};
        if(this.state.postType === "freeResponse")
        {
            let titleStart = "What's your experience with";
            newTitle = titleStart.concat(" " , this.state.postQuestion);
            newOptions = {};
        } else if (this.state.postType === "poll")
        {
            let titleStart = "Do you support";
            newTitle = titleStart.concat(" " , this.state.postQuestion);
            let newOptionsArray = ["Yes", "Unsure", "No"];
            newOptions = Object.fromEntries(newOptionsArray.map(key => [key, 0]));
        } else if (this.state.postType === "thisOrThat")
        {
            let titleStart = "Which do you think is";
            newTitle = titleStart.concat(" " , this.state.postQuestion);
            newOptions = Object.fromEntries(this.state.options.map(key => [key, 0]));
        }

        var postData : Post = {
            authorID: this.state.currentUserID,
            displayType: this.state.postType,
            title: newTitle,
            topic: this.state.postTags,
            options: newOptions
        }

        var newPostKey = firebase.database().ref().child('posts').push().key;
        var updates: any = {};
        updates['/posts/' + newPostKey] = postData;
        console.log(`Post Key: /posts/${newPostKey}`);
        firebase.database().ref().update(updates);

        this.setState({
            postQuestion: "",
            postTags: "",
            options: ["", "", ""],
            currentUserID: "",
        });
    };
}
