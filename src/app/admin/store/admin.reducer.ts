import {
    SET_VENUES,
    SET_VENUE,
    SET_ITEMS,
    SET_ITEM,
    SET_LANGUAGES_SPECIFIC_CONTENT,
    SET_LANGUAGE_SPECIFIC_CONTENT,
    SET_SELECTED_LANGUAGENAME,
    SET_EMPTY_STATE,
    AdminActions,
    SET_STATE_FROM_LS,
} from "./admin.actions";

import * as fromRoot from '../../app.reducer'
import { createFeatureSelector, createReducer, createSelector, on } from "@ngrx/store";
import { Item, LSContent, Venue } from '../../shared/item.model';
import * as venuesService from './../services/venues.service'
import { VenuesService } from '../services/venues.service';
// import { EMPTY_STORE, set_venues } from "./admin.actions";




export interface AdminState {
    venues: Venue[];
    venue: Venue;
    items: Item[];
    item: Item;
    languagesSpecificContent: LSContent[];
    languageSpecificContent: LSContent;
    selectedLanguageName: string;
    createdAt?: number



}

export interface State extends fromRoot.State {
    admin: AdminState
}

let initialState: AdminState = {
    venues: [],
    venue: null,
    items: [],
    item: null,
    languagesSpecificContent: [],
    languageSpecificContent: null,
    selectedLanguageName: null
}



export function adminReducer(state = initialState, action: AdminActions) {

    switch (action.type) {
        case SET_VENUES: {
            // storeState({
            //     ...state,
            //     createdAt: new Date().getTime(),
            //     venues: action.payload
            // })
            return {
                ...state,
                venues: action.payload
            };
        };
        case SET_VENUE: {
            console.log('setting venue')
            console.log(action.payload)
            // storeState({
            //     ...state,
            //     createdAt: new Date().getTime(),
            //     venue: action.payload
            // })
            return {
                ...state,
                venue: action.payload
            }
        }
        case SET_ITEMS: {
            // storeState({
            //     ...state,
            //     createdAt: new Date().getTime(),
            //     items: action.payload
            // })
            return {
                ...state,
                items: action.payload
            }
        }
        case SET_ITEM: {

            // console.log(action.payload)
            // storeState({
            //     ...state,
            //     createdAt: new Date().getTime(),
            //     item: action.payload
            // })
            return {
                ...state,
                item: action.payload
            }
        }
        case SET_LANGUAGES_SPECIFIC_CONTENT: {

            // storeState({
            //     ...state,
            //     createdAt: new Date().getTime(),
            //     languagesSpecificContent: action.payload
            // })

            return {
                ...state,
                languagesSpecificContent: action.payload
            }
        }
        case SET_LANGUAGE_SPECIFIC_CONTENT: {

            // storeState({
            //     ...state,
            //     createdAt: new Date().getTime(),
            //     languageSpecificContent: action.payload
            // })
            return {
                ...state,
                languageSpecificContent: action.payload
            }
        }
        case SET_SELECTED_LANGUAGENAME: {

            // storeState({
            //     ...state,
            //     createdAt: new Date().getTime(),
            //     selectedLanguageName: action.payload
            // })
            return {
                ...state,
                selectedLanguageName: action.payload
            }
        }
        case SET_EMPTY_STATE: {
            console.log('setting empty state')
            state = initialState
            return {
                ...state
            }
        }
        // case SET_STATE_FROM_LS: {
        //     const stateFromLS: AdminState = JSON.parse(localStorage.getItem('state'))
        //     initialState = stateFromLS
        //     console.log(initialState)
        // }
        default: {
            return state
        }
    }
}

// function storeState(state) {
//     localStorage.setItem('adminState', JSON.stringify(state))
// }

export function getStateFromLS(adminStateFromLS: AdminState) {
    console.log('getStateFromLS')
    // const adminStateFromLS = JSON.parse(localStorage.getItem('adminState'))
    initialState = adminStateFromLS;
    console.log(initialState)
}


export const getAdminState = createFeatureSelector<AdminState>('admin');

export const getCurrentState = createSelector(
    getAdminState,
    (state: AdminState) => state
)

export const getVenues = createSelector(
    getAdminState,
    (state: AdminState) => state.venues);

export const getVenue = createSelector(
    getAdminState,
    (state: AdminState) => state.venue);

export const getItems = createSelector(
    getAdminState,
    (state: AdminState) => state.items);

export const getItem = createSelector(
    getAdminState,
    (state: AdminState) => state.item
)

export const getLanguages = createSelector(
    getAdminState,
    (state: AdminState) => state.languagesSpecificContent
)
export const getLanguage = createSelector(
    getAdminState,
    (state: AdminState) => state.languageSpecificContent
)
export const getSelectedLanguageName = createSelector(
    getAdminState,
    (state: AdminState) => state.selectedLanguageName
)

