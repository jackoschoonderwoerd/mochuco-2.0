import { Action } from "@ngrx/store";

export const SET_AUTH_UID = '[Auth] Set Authenticated';
export const SET_UNAUTHENTICATED = '[Auth] Set Unauthenticated';
export const SET_IS_ADMIN = '[Auth] Set Is Admin'


export class SetAuthUid implements Action {
    readonly type = SET_AUTH_UID;
    constructor(public payload: string) { }
}


export class SetUnauthenticated implements Action {
    readonly type = SET_UNAUTHENTICATED

}
export class SetIsAdmin implements Action {
    readonly type = SET_IS_ADMIN
    constructor(public payload: boolean) { }
}

export type AuthActions =
    | SetAuthUid
    | SetUnauthenticated
    | SetIsAdmin
