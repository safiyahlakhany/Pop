import { PopActions, actionIdentifier, setCurrentPageAction, updateFiltersAction, updatePostIdAction, updateCurrentUserAction } from './actions';
import { PopAppState, pages, filters } from './types';

// Reducer
// The reducer is a function that takes the previous 
// state and an action as parameters, and returns the next state. 
// Here the state of the app is defined by a count variable
// 2 actions are present : increase and decrease
// the actions update count

// State of the app
// It is defined by count

// https://redux.js.org/advanced/usage-with-react-router

const intialState: PopAppState = { currentPage: pages.WelcomePage, currentUser: "", currentFilters: filters, clickedPostID: ""}


function popReducer(state: PopAppState | undefined, action: PopActions) : PopAppState {
    if (state === undefined) {
        return intialState;
    }

    switch (action.type) {
        case actionIdentifier.SETCURRENTPAGE: {
            let addAction = action as setCurrentPageAction; //  treat the `action` object as a JoinObject

            const newState = JSON.parse(JSON.stringify(state));
            newState.currentPage = addAction.payload;

            return newState;
        }
        case actionIdentifier.UPDATEFILTERS: {
            let addAction = action as updateFiltersAction; //  treat the `action` object as a JoinObject

            const newState = JSON.parse(JSON.stringify(state));
            newState.currentFilters[addAction.payload.group].value[addAction.payload.filter].value = addAction.payload.value;
            return newState;
        }
        case actionIdentifier.UPDATEPOSTID: {
            let addAction = action as updatePostIdAction; 

            const newState = JSON.parse(JSON.stringify(state));
            newState.clickedPostID = addAction.payload;

            return newState;
        }
        case actionIdentifier.UPDATECURRENTUSER: {
            let addAction = action as updateCurrentUserAction; 
            const newState = JSON.parse(JSON.stringify(state));
            newState.currentUser = addAction.payload;
            return newState;
        }
        default:
            return state;
    }
}

export default popReducer;