import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Auth } from '@angular/fire/auth';
import {
    Storage,
    ref,
    deleteObject,
    uploadBytes,
    uploadString,
    uploadBytesResumable,
    percentage,
    getDownloadURL,
    getMetadata,
    provideStorage,
    getStorage,
    getBytes,
} from '@angular/fire/storage';
import {
    Firestore,
    addDoc,
    collection,
    collectionData,
    collectionGroup,
    doc,
    docData,
    deleteDoc,
    updateDoc,
    DocumentReference,
    setDoc,
    orderBy,
    query,
    where
} from '@angular/fire/firestore';
import { Item, Venue } from 'src/app/shared/item.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ErrPageComponent } from '../shared/err-page/err-page.component';
import { ItemDetailsDbService } from '../services/item-details-db.service';
import * as fromAdmin from '../store/admin.reducer';
import * as Admin from '../store/admin.actions';
import { Store } from '@ngrx/store';
import { set_venue, set_venues } from '../store/admin.actions';








@Injectable(
    {
        providedIn: 'root'
    }
)


export class VenuesService {

    constructor(
        private firestore: Firestore,
        private afAuth: Auth,
        private storage: Storage,
        private dialog: MatDialog,
        private itemDetailsDbService: ItemDetailsDbService,
        private store: Store<fromAdmin.State>
    ) { }


    private venueSubject = new BehaviorSubject<Venue>(null)
    public venue$ = this.venueSubject.asObservable();

    createVenue(venue: Venue): Promise<DocumentReference<any>> {
        const venueRef = collection(this.firestore, 'venues')
        return addDoc(venueRef, venue)
    }

    // createVenue(venue: Venue) {
    //     const venueRef = collection(this.firestore, 'venues')
    //     addDoc(venueRef, venue)
    //     .then(() => {
    //         const userId = this.afAuth.currentUser.uid
    //         this.readVenues(userId)
    //     })
    // }


    readVenues(userId): void {
        const venuesRef = collection(this.firestore, 'venues');
        if (userId !== 'P91mUtOGYsMxBdjT2dqAAMzaBeG2') {
            console.log('non-ademn')
            const venuesByUserId = query(venuesRef, where('ownerId', '==', userId), orderBy('venueName'))
            collectionData(venuesByUserId, { idField: 'id' }).subscribe((venues: Venue[]) => {
                this.store.dispatch(new Admin.SetVenues(venues))
            })
            // return collectionData(venuesByUserId, { idField: 'id' }) as Observable<Venue[]>;
        } else {
            console.log('is admin')
            const allVenuesRef = query(venuesRef, orderBy('venueName'))
            collectionData(allVenuesRef, { idField: 'id' }).subscribe((venues: Venue[]) => {
                console.log('dispatching venues')
                this.store.dispatch(new Admin.SetVenues(venues));
            })
        }
    }

    readVenue(venueId): void {
        console.log(venueId)
        const venueRef = doc(this.firestore, `venues/${venueId}`)
        // return docData(venueRef, { idField: 'id' }) as Observable<Venue>
        docData(venueRef, { idField: 'id' }).subscribe((venue: Venue) => {
            console.log('dispatching venue')
            this.store.dispatch(new Admin.SetVenue(venue))
        })
    }

    updateVenueName(venueId: string, venueName: string): Promise<void> {
        const venueRef = doc(this.firestore, `venues/${venueId}`)
        return updateDoc(venueRef, { venueName: venueName })
    }

    updateVenueLogoUrl(venueId: string, logoUrl: string) {
        const venueRef = doc(this.firestore, `venues/${venueId}`)
        return updateDoc(venueRef, { logoUrl: logoUrl })
    }

    async updateVenueLogoStorage(venueId: string, file: File) {
        if (file) {
            try {
                const path = `venues/${venueId}/logo`
                const storageRef = ref(this.storage, path);
                const task = uploadBytesResumable(storageRef, file);
                await task;
                const url = await getDownloadURL(storageRef)
                return url;
            } catch (e: any) {
                console.log(e);
            }
        } else {
            this.deleteLogo(venueId);
        }
    }

    private deleteLogo(venueId: string) {
        return this.deleteLogoImageFileFromSt(venueId)
            .then(res => {
                this.updateVenueLogoUrl(venueId, null)
            })
            .catch(err => {
                console.log(err)
                this.dialog.open(ErrPageComponent, {
                    data: {
                        message: `deleteLogoImageFileFromSt failed`,
                        err: err
                    }
                })

            })
    }

    private deleteLogoImageFileFromSt(venueId): Promise<void> {
        const path = `venues/${venueId}/logo`;
        const docRef = ref(this.storage, path)
        return getDownloadURL(docRef)
            .then((res) => {
                console.log(res)
                deleteObject(docRef).then((res) => {
                    console.log(res);

                })
            })
            .catch(err => console.log(err))
    }

    async checkIfFileExists(venueId: string) {
        const path = `venues/${venueId}/logo`
        const docRef = ref(this.storage, path)
        try {
            await getDownloadURL(docRef)
            return true
        } catch (error) {
            return false
        }
    }



    deleteVenue(venueId: string) {
        return this.deleteLogoImageFileFromSt(venueId)
            .then((res) => {
                const venueRef = doc(this.firestore, `venues/${venueId}`);
                return deleteDoc(venueRef)
            })
            .catch(err => console.log(err))
    }

    updateItemImageUrl(venueId: string, itemId: string, imageUrl: string): Promise<void> {
        const itemRef = doc(this.firestore, `venues/${venueId}/items/${itemId}`)
        return updateDoc(itemRef, { imageUrl: imageUrl })
    }

    // ******

    readItems(venueId: string) {
        const itemsCollectionRef = collection(this.firestore, `venues/${venueId}/items`);
        return collectionData(itemsCollectionRef, { idField: 'id' })
    }

    readLanguages(venueId: string, itemId: string) {
        const languagesRef = collection(this.firestore, `venues/${venueId}/items/${itemId}/languages`)
        return collectionData(languagesRef, { idField: 'id' })
    }

    deleteAudioFileFromSt(venueId: string, itemId: string, language: string) {
        const audioFileRef = ref(this.storage, `venues/${venueId}/items/${itemId}/audio/${language}`)
        return deleteObject(audioFileRef)
    }
    updateAudioUrlToNull(venueId: string, itemId: string, language: string) {
        const audioUrlRef = doc(this.firestore, `venues/${venueId}/items/${itemId}/languages/${language}`)
        return updateDoc(audioUrlRef, { audioUrl: null })
    }


    readStats(venueId) {
        const statsRef = collection(this.firestore, `venues/${venueId}/visitsLog`)
        return collectionData(statsRef);
    }


    // updateOwner(venueId: string) {
    //     const userId = this.afAuth.currentUser.uid
    //     console.log('updating user', userId)
    //     const coursesOwnedRef = doc(this.firestore, `users/${userId}/venuesOwned/${venueId}`);
    //     return setDoc(coursesOwnedRef, {})
    // }
    // deleteLogoImageUrlFromDb(venueId) {
    //     const path = `venues/${venueId}`
    //     const venueRef = doc(this.firestore, path)
    //     return updateDoc(venueRef, { logoUrl: null })
    // }

    // setVenue(venue: Venue) {
    // //     console.log('setting venue', venue);
    // //     // return null;
    // //     const venueRef = doc(this.firestore, `venues/${venue.id}`)
    // //     return setDoc(venueRef, venue)
    // // }
}

// CREATE VENUE
// READ VENUES
// READ VENUE
// UPDATE VENUE
// UPDATE VENUE NAME
// UPDATE VENUE LOGO
// DELETE VENUE
