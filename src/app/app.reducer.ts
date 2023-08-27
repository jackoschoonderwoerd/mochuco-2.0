// import * as fromUi from './shared/ui.reducer'
import * as fromAuth from './../app/admin/auth/auth.reducer'
import * as fromAdmin from './admin/store/admin.reducer'
import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store'
// import { AdminState } from './admin/store/admin.reducer';


export interface State {
    // ui: fromUi.LoadingState
    auth: fromAuth.AuthState
}

export const reducers: ActionReducerMap<State> = {
    // ui: fromUi.uiReducer,
    auth: fromAuth.authReducer,
    // admin: fromAdmin.adminReducer
}

// export const getUiState = createFeatureSelector<fromUi.LoadingState>('ui');
// export const getIsLoading = createSelector(getUiState, fromUi.getIsLoading);

export const getAuthState = createFeatureSelector<fromAuth.AuthState>('auth');
export const getAdminState = createFeatureSelector<fromAdmin.AdminState>('admin');

export const getAuthUid = createSelector(getAuthState, fromAuth.getAuthUid);
export const getIsAdmin = createSelector(getAuthState, fromAuth.getIsAdmin);

