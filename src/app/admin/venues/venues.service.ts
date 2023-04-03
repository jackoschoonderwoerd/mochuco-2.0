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
import { Item } from 'src/app/shared/item.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ErrPageComponent } from '../shared/err-page/err-page.component';
import { ItemDetailsDbService } from './venue-details/item-details/item-details-db.service';





export interface Venue {
    ownerId: string;
    venueName: string;
    logoUrl?: string;
    id?: string;
    items?: Item[];
}


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
        private itemDetailsDbService: ItemDetailsDbService


        // private snackbar: MatSnackBar
    ) { }

    private venuesSubject = new BehaviorSubject<Venue[]>(null)
    public venues$ = this.venuesSubject.asObservable()

    private venueSubject = new BehaviorSubject<Venue>(null)
    public venue$ = this.venueSubject.asObservable();

    // private itemmSubject = new BehaviorSubject<Item>(null);
    // public item$ = this.itemmSubject.asObservable();

    createVenue(venue: Venue): Promise<DocumentReference<any>> {
        console.log(venue);
        const venueRef = collection(this.firestore, 'venues')
        return addDoc(venueRef, venue)
    }

    readVenues(userId): Observable<Venue[]> {
        const venuesRef = collection(this.firestore, 'venues');
        if (userId !== 'P91mUtOGYsMxBdjT2dqAAMzaBeG2') {
            const venuesByUserId = query(venuesRef, where('ownerId', '==', userId), orderBy('venueName'))
            return collectionData(venuesByUserId, { idField: 'id' }) as Observable<Venue[]>;
        } else {
            const allVenuesRef = query(venuesRef, orderBy('venueName'))
            return collectionData(allVenuesRef, { idField: 'id' }) as Observable<Venue[]>
        }
    }

    readVenue(venueId): Observable<Venue> {
        console.log(venueId)
        const venueRef = doc(this.firestore, `venues/${venueId}`)
        return docData(venueRef, { idField: 'id' }) as Observable<Venue>
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
        const path = `venues/${venueId}/logo`
        const storageRef = ref(this.storage, path)
        return deleteObject(storageRef)
    }



    deleteVenue(venueId: string) {
        return this.deleteLogoImageFileFromSt(venueId)
            .then((res) => {
                const venueRef = doc(this.firestore, `venues/${venueId}`);
                return deleteDoc(venueRef)
            })
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
