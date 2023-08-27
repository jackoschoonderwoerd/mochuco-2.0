import { Action } from "@ngrx/store";

import { Item, LSContent, Venue } from "../../shared/item.model";
import { AdminState } from "./admin.reducer";

import { createAction, props } from "@ngrx/store";

export const SET_VENUES = '[Admin] Set Venues';

// (Venue[]) adds all venues belonging to a particular customer to the store

export const SET_VENUE = '[Admin] Set Venue';
// (Venue) adds a particular venue to the store;

export const SET_ITEMS = '[Admin] Set Items';
// (Item[]) adds all items belonging to a particular venue to the store

export const SET_ITEM = '[Admin] Set Item';
// (ITEM) adds a particular item to the store

export const SET_LANGUAGES_SPECIFIC_CONTENT = '[Admin] Set Languages Specific Content';
// (LSContent[]) adds all languages belonging to a particular item to the store

export const SET_LANGUAGE_SPECIFIC_CONTENT = '[Admin] Set Language Specific Content'

export const SET_SELECTED_LANGUAGENAME = '[Admin] Set selected language'
// (LSContent) adds a particular language to the store

export const SAVE_STATE_TO_LS = '[Admin] Save State To LS'

export const SET_STATE_FROM_LS = '[Admin] Set State From LS'

export const SET_EMPTY_STATE = '[Admin] Set Empty State'

export const RESTORE_STATE = '[Admin] Restore State'

export const set_venues = createAction(
    '[Admin] Set Venues',
    props<{ venues: Venue[] }>()
)
export const set_venue = createAction(
    '[Admin] SetVenue',
    props<{ venue: Venue }>()
)



export class SetVenues implements Action {
    readonly type = SET_VENUES
    constructor(public payload: Venue[]) { }
}

export class SetVenue implements Action {
    readonly type = SET_VENUE
    constructor(public payload: Venue) { }
}
export class SetItems implements Action {
    readonly type = SET_ITEMS
    constructor(public payload: Item[]) { }
}
export class SetItem implements Action {
    readonly type = SET_ITEM;
    constructor(public payload: Item) { }
}
export class SetLanguagesSpecificContent implements Action {
    readonly type = SET_LANGUAGES_SPECIFIC_CONTENT;
    constructor(public payload: LSContent[]) { }
}
export class SetLanguageSpecificContent implements Action {
    readonly type = SET_LANGUAGE_SPECIFIC_CONTENT;
    constructor(public payload: LSContent) { }
}

export class SaveStateToLs implements Action {
    readonly type = SAVE_STATE_TO_LS;
    constructor(public payload: AdminState) { }
}
export class SetSelectedLanguage implements Action {
    readonly type = SET_SELECTED_LANGUAGENAME;
    constructor(public payload: string) { }
}


export class SetEmptyState implements Action {
    readonly type = SET_EMPTY_STATE;
    // constructor(public payload: AdminState) { }
}

export class RestoreState implements Action {
    readonly type = RESTORE_STATE
}


export type AdminActions =
    | SetVenues
    | SetVenue
    | SetItems
    | SetItem
    | SetLanguagesSpecificContent
    | SetLanguageSpecificContent
    | SetSelectedLanguage
    | SaveStateToLs
    | RestoreState
    | SetEmptyState



