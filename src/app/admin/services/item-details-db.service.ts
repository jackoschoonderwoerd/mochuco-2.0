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
    StringFormat,
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
    query
} from '@angular/fire/firestore';
import { Item, } from 'src/app/shared/item.model';
import { LSContent, Venue } from '../../shared/item.model';
import { VenuesService } from 'src/app/admin/services/venues.service';
import * as fromAdmin from '../store/admin.reducer';
import * as Admin from '../store/admin.actions';
import { Store } from '@ngrx/store';
import { LscService } from './lsc.service';
import { Router } from '@angular/router';




@Injectable(
    {
        providedIn: 'root'
    }
)
export class ItemDetailsDbService {


    // private itemmSubject = new BehaviorSubject<Item>(null);
    // public item$ = this.itemmSubject.asObservable();


    constructor(
        private firestore: Firestore,
        private afAuth: Auth,
        private storage: Storage,
        private store: Store<fromAdmin.AdminState>,
        private lscService: LscService,
        private router: Router
        // private venuesService: VenuesService
    ) { }

    createItem(venueId: string, item: Item) {
        // console.log('adding item')
        const itemRef = collection(this.firestore, `venues/${venueId}/items`)
        // return addDoc(itemRef, item)
        addDoc(itemRef, item)
            .then((docRef: any) => {
                item.id = docRef.id
                this.store.dispatch(new Admin.SetItem(item))
                this.store.dispatch(new Admin.SetLanguagesSpecificContent([]))
                this.router.navigate(['admin/item-details', { venueId: venueId, itemId: item.id }])
            })
            .catch((err: any) => {
                console.log('unable to create item', err);
            })
    }

    readItems(venueId): void {
        const itemsRef = collection(this.firestore, `venues/${venueId}/items`);
        const orderedItemsRef = query(itemsRef, orderBy('name'))
        // return collectionData(orderedItemsRef, { idField: 'id' }) as Observable<Item[]>
        collectionData(orderedItemsRef, { idField: 'id' }).subscribe((items: Item[]) => {
            this.store.dispatch(new Admin.SetItems(items))
        })
    }
    readItemsLength(venueId: string) {
        const itemsRef = collection(this.firestore, `venues/${venueId}/items`);
        return collectionData(itemsRef)
    }
    readItem(venueId: string, itemId: string) {

        this.store.select(fromAdmin.getVenue).subscribe((venue: Venue) => {
            const itemRef = doc(this.firestore, `venues/${venue.id}/items/${itemId}`);
            // return docData(itemRef, { idField: 'id' })
            docData(itemRef, { idField: 'id' }).subscribe((item: Item) => {
                this.store.dispatch(new Admin.SetItem(item));
            })
        })
    }
    updateItemImageUrl(venueId: string, itemId: string, imageUrl: string) {
        const itemImageUrlRef = doc(this.firestore, `venues/${venueId}/items/${itemId}`);
        return updateDoc(itemImageUrlRef, { imageUrl: imageUrl })
    }
    updateItemName(venueId: string, itemId: string, name: string) {
        const itemRef = doc(this.firestore, `venues/${venueId}/items/${itemId}`)
        return updateDoc(itemRef, { name })
    }
    updateItemCoordinates(venueId: string, itemId: string, latitude: string, longitude: string) {
        // console.log(venueId, itemId, latitude, longitude)
        const itemRef = doc(this.firestore, `venues/${venueId}/items/${itemId}`)
        return updateDoc(itemRef, { latitude, longitude })
    };

    readItemVisits(venueId: string, itemId: string) {
        // console.log(venueId, itemId)
        const itemVisitssRef = collection(this.firestore, `venues/${venueId}/visitsLog/${itemId}/visits`);
        const sortedVisits = query(itemVisitssRef, orderBy('timestamp'))
        return collectionData(sortedVisits, { idField: 'id' })
    }
    deleteVisit(venueId: string, itemId: string, visitId: string) {
        // console.log(venueId, itemId, visitId)
        const visitRef = doc(this.firestore, `venues/${venueId}/visitsLog/${itemId}/visits/${visitId}`)
        return deleteDoc(visitRef)
    }

    deleteItem(venueId: string, itemId: string) {


        const languagesRef = collection(this.firestore, `venues/${venueId}/items/${itemId}/languages`);
        collectionData(languagesRef).subscribe((lscs: LSContent[]) => {
            console.log(lscs)
            if (lscs.length > 0) {
                lscs.forEach((lsc: LSContent) => {
                    if (lsc.audioUrl) {
                        console.log(`deleting audioFile ${lsc.language}`)
                        this.lscService.deleteAudioFile(venueId, itemId, lsc.language)
                            .then(() => {
                                console.log(`audiofile deleted ${lsc.language}`)
                            })
                    }
                })
                lscs.forEach((lsc: LSContent) => {
                    console.log(`deleting ${lsc.language} from db`)
                    this.lscService.deleteLSC(venueId, itemId, lsc.language)
                        .then((res) => {
                            console.log(`lsc ${lsc.language} deleted`)
                        })
                })
            }
        })
        this.checkIfFileExists(venueId, itemId).then(res => {
            console.log(res)
            if (res) {
                this.deleteItemImageFile(venueId, itemId)
                    .then(() => {
                        console.log(`itemImageFile updated ${itemId}`)
                    })
                    .catch((err) => { console.log(err) })
            }
            const itemRef = doc(this.firestore, `venues/${venueId}/items/${itemId}`)
            deleteDoc(itemRef)
                .then(() => {
                    console.log(`item ${itemId} deleted`)
                })
        })
        this.store.dispatch(new Admin.SetItem(null))
        this.readItems(venueId)
    }

    deleteLssc() {

    }

    // updateItemImageFile(venueId: string, itemId: string, imageFile: File) {
    //     const imageFileRef = ref(this.storage, `venues/${venueId}/items/${itemId}/itemImage`)
    //     return deleteObject(imageFileRef)
    // }



    deleteItemImageFile(venueId, itemId) {
        console.log(`deleting file`)
        const imageFileRef = ref(this.storage, `venues/${venueId}/items/${itemId}/itemImage`)
        return deleteObject(imageFileRef)
        // .then((res) => {
        //     console.log(`itemImageFile deleted; ${res}`)
        // })
        // .catch((err) => {
        //     console.log(`deleting itemImageFile failed; ${err}`)
        // })

        // const promise = new Promise((resolve, reject) => {
        //     getDownloadURL(imageFileRef).then((url: string) => {
        //         if (url) {
        //             console.log(url)
        //             resolve(url)
        //         } else {
        //             console.log(`no url`)
        //             reject(null);
        //         }
        //     })
        // })
        // return promise
    }

    checkIfFileExists(venueId, itemId) {
        const storage = getStorage();
        const storageRef = ref(this.storage, `venues/${venueId}/items/${itemId}/itemImage`)

        const promise = new Promise((resolve, reject) => {
            getDownloadURL(storageRef)
                .then(url => {
                    resolve(true);
                })
                .catch(error => {
                    if (error.code === 'storage/object-not-found') {
                        console.log(`not found`)
                        resolve(false);
                    } else {
                        reject(error);
                    }
                });
        })
        return promise
    }


    deleteAudioFilesFromStorage(venueId, itemId) {
        this.getLscsByItem(venueId, itemId)
            .subscribe((lssc: LSContent[]) => {
                const languages: string[] = [];
                // console.log(lssc);
                lssc.forEach((lsc: LSContent) => {
                    languages.push(lsc.language);
                })
                console.log(languages);
                languages.forEach((language: string) => {
                    this.updateItemAudioUrl(venueId, itemId, language, null)
                        .then(res => {
                            console.log(res)
                        })

                        .catch(err => {
                            console.log(err)
                        })
                })
            })
    }

    getLscsByItem(venueId: string, itemId: string): Observable<any> {
        const languagesByItemIdRef = collection(this.firestore, `venues/${venueId}/items/${itemId}/languages`)
        collectionData(languagesByItemIdRef).subscribe((lsSContent: LSContent[]) => {
            this.store.dispatch(new Admin.SetLanguagesSpecificContent(lsSContent))
        })
        return collectionData(languagesByItemIdRef)
    }

    getAvailableLanguages(venueId: string, itemId: string) {
        const getLanguagesRef = collection(this.firestore, `venues/${venueId}/items/${itemId}/languages`)
        return collectionData(getLanguagesRef)
    }
    updateItemAudioUrl(venueId: string, itemId: string, language: string, audioUrl: string) {
        console.log(venueId, itemId, language, audioUrl);
        const itemAudioUrl = doc(this.firestore, `venues/${venueId}/items/${itemId}/languages/${language}`);
        return updateDoc(itemAudioUrl, { audioUrl })
    }
    getAudioByLanguage(venueId: string, itemId: string, language: string) {
        const itemAudioUrl = doc(this.firestore, `venues/${venueId}/items/${itemId}/languages/${language}`);
        return docData(itemAudioUrl)
    }

    updateMainPageProperty(venueId: string, itemId: string, status: boolean) {
        const itemRef = doc(this.firestore, `venues/${venueId}/items/${itemId}`)
        return updateDoc(itemRef, { isMainItem: status })
    }
    // CREATE ITEM
    // updateLscDescription(venueId: string, itemId: string, language: string, description: string) {
    //     const descriptionRef = doc(this.firestore, `venues/${venueId}/items/${itemId}/languages/${language}`)
    //     return updateDoc(descriptionRef, { description })
    // }

    // READ ITEM
    // READ ITEMS
    // UPDATE ITEM
    // UPDATE ITEM NAME
    // UPDATE ITEM IMAGE
    // DELETE ITEM

    // CREATE LSC
    // READ LSC
    // READ LSCS
    // UPDATE LSC
    // UPDATE LSC NAME
    // UPDATE LSC DESCRIPTION
    // UPDATE LSC AUDIO
    // DELETE LSC

}
