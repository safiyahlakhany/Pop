// State of the app

export enum pages {
    SignupPage,
    SigninPage,
    WelcomePage,
    HomePage,
    PostPage,
    ProfilePage
}

export const ageFilters : Filters = {
  underTwelve: {value: false, label: "<12"},
  twelveToSeventeen: {value: false, label: "12 - 17"},
  eighteenToTwentyfour: {value: false, label: "18 - 24"},
  twentyfiveToThirtyfour: {value: false, label: "25 - 34"},
  thirtyfiveToFortyfour: {value: false, label: "35 - 44"},
  fortyfiveToFiftyfour: {value: false, label: "45 - 54"},
  fiftyfiveToSixtyfour: {value: false, label: "55 - 64"},
  sixtyfiveToSeventyfour: {value: false, label: "65 - 74"},
  seventyfiveOrOlder: {value: false, label: "75+"}
}

export const genderFilter : Filters = {
  male: {value: false, label: "male"},
  female: {value: false, label: "female"},
  nb: {value: false, label: "nonbinary"},
}

export const filters : Filters = {
  age: {value: ageFilters, label: "age"},
  gender: {value: genderFilter, label: "gender"}
}

export interface Filters {
  [key: string]: {value: any, label: string}
}

export interface changedFilter {
  group: keyof typeof filters;
  filter: keyof typeof ageFilters;
  value: boolean;
}

export interface Comment {
  authorID: string;
  postID: string;
  option?: string;
  textContent?: string;
}

export interface graphData {
  name: string;
  data: number;
}

export interface User {
  userID: string;
  icon: string;
}

export interface Post {
  authorID: string,
  displayType: string,
  title: string,
  topic: string,
  options: Options,
}

export interface Options {
  [key: string]: number
}

// to update postID
export interface changedPostID {
  postID: string;
}

export interface PopAppState {
    currentPage: pages;
    currentUser: string;
    currentFilters: Filters;
    clickedPostID: string;
}

export default PopAppState;
