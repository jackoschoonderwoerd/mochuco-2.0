import { AuthActions, SET_AUTH_UID, SET_UNAUTHENTICATED, SET_IS_ADMIN } from "./auth.actions";
import { User as FirebaseUser } from "firebase/auth";

export interface AuthState {
    authUid: string;
    isAdmin: boolean;
}

const initialState: AuthState = {
    authUid: null,
    isAdmin: false

}

export function authReducer(state = initialState, action: AuthActions): AuthState {
    switch (action.type) {
        case SET_AUTH_UID: {
            return {
                ...state,
                authUid: action.payload,

            };
        };
        case SET_UNAUTHENTICATED: {
            return {
                ...state,
                authUid: null,

            };
        };
        case SET_IS_ADMIN: {
            return {
                ...state,
                isAdmin: action.payload
            }
        }
        default: {
            return state
        }
    }
}

export const getAuthUid = (state: AuthState) => state.authUid;
export const getIsAdmin = (state: AuthState) => state.isAdmin

