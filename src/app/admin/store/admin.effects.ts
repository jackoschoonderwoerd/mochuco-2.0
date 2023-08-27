import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import * as fromAdmin from './admin.reducer'
import { Store } from '@ngrx/store';
import { RESTORE_STATE, SET_ITEM, SET_ITEMS, SET_LANGUAGES_SPECIFIC_CONTENT, SET_LANGUAGE_SPECIFIC_CONTENT, SET_VENUES } from '../store/admin.actions';
import { set_venues, set_venue, SET_VENUE } from './admin.actions';
import { tap, withLatestFrom, BehaviorSubject } from 'rxjs';
import { selectAdminState } from './admin.selectors';
import { AdminState } from './admin.reducer';
import { Item, LSContent, Venue } from 'src/app/shared/item.model';

@Injectable()

export class AdminEffects {



    constructor(
        private actions$: Actions,
        private store: Store<fromAdmin.AdminState>) { }

    setVenues = createEffect(() => this.actions$.pipe(
        ofType(SET_VENUES),
        tap((data: any) => {
            console.log('set_venues effect called', data)
            this.store.subscribe((adminState: AdminState) => {
                // console.log(adminState)
                // localStorage.setItem('newAdminState', JSON.stringify(adminState))
            })
        })
    ), { dispatch: false })

    set_venue = createEffect(() => this.actions$.pipe(
        ofType(SET_VENUE),
        tap((data: Venue) => {
            console.log('set_venue effect called', data);
            // this.storeInLS()
        })
    ), { dispatch: false });

    set_items = createEffect(() => this.actions$.pipe(
        ofType(SET_ITEMS),
        tap((data: Item[]) => {
            console.log('set_items effect called', data)
            // this.storeInLS()
        })
    ), { dispatch: false });

    set_item = createEffect(() => this.actions$.pipe(
        ofType(SET_ITEM),
        tap((data: Item) => {
            console.log('set item effect called', data)
        })
    ), { dispatch: false });

    set_lssc = createEffect(() => this.actions$.pipe(
        ofType(SET_LANGUAGES_SPECIFIC_CONTENT),
        tap((data: LSContent[]) => {
            console.log('set_lssc effect called', data)
        })
    ), { dispatch: false });

    set_lsc = createEffect(() => this.actions$.pipe(
        ofType(SET_LANGUAGE_SPECIFIC_CONTENT),
        tap((data: LSContent) => {
            console.log('set lsc effect called', data)

        })
    ), { dispatch: false });

    saveStateToLs = createEffect(() => this.actions$.pipe(
        ofType(
            SET_VENUES,
            SET_VENUE,
            SET_ITEMS,
            SET_ITEM,
            SET_LANGUAGES_SPECIFIC_CONTENT,),
        tap((adminState: AdminState) => {
            console.log('save state effect called', adminState)
            this.store.select(fromAdmin.getAdminState)
                .subscribe((adminState: AdminState) => {
                    const newAdminState: AdminState = { ...adminState }
                    newAdminState.createdAt = new Date().getTime()
                    localStorage.setItem('adminState', JSON.stringify(newAdminState));
                })

        })
    ), { dispatch: false });

    restoreState = createEffect(() => this.actions$.pipe(
        ofType(RESTORE_STATE),
        tap(() => {
            if (localStorage.getItem('adminState')) {
                const adminState: AdminState = JSON.parse(localStorage.getItem('adminState'))
            } else {
                console.log('no state found in LS')
            }
        })
    ), { dispatch: false })




}
