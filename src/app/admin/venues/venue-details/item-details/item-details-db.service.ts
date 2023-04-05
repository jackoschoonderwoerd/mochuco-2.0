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
import { Item } from 'src/app/shared/item.model';
import { ItemByLanguage, LSContent } from '../../../../shared/item.model';
import { VenuesService, Venue } from '../../venues.service';


@Injectable(
    {
        providedIn: 'root'
    }
)
export class ItemDetailsDbService {


    private itemmSubject = new BehaviorSubject<Item>(null);
    public item$ = this.itemmSubject.asObservable();


    constructor(
        private firestore: Firestore,
        private afAuth: Auth,
        private storage: Storage,
        // private venuesService: VenuesService
    ) { }

    createItem(venueId: string, item: Item) {
        console.log('adding item')
        const itemRef = collection(this.firestore, `venues/${venueId}/items`)
        return addDoc(itemRef, item)
    }
    readItems(venueId): Observable<Item[]> {
        const itemsRef = collection(this.firestore, `venues/${venueId}/items`);
        const orderedItemsRef = query(itemsRef, orderBy('name'))
        return collectionData(orderedItemsRef, { idField: 'id' }) as Observable<Item[]>
    }
    readItem(venueId: string, itemId: string) {
        const itemRef = doc(this.firestore, `venues/${venueId}/items/${itemId}`);
        return docData(itemRef, { idField: 'id' })
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
        console.log(venueId, itemId, latitude, longitude)
        const itemRef = doc(this.firestore, `venues/${venueId}/items/${itemId}`)
        return updateDoc(itemRef, { latitude, longitude })
    };

    readItemVisits(venueId: string, itemId: string) {
        console.log(venueId, itemId)
        const itemVisitssRef = collection(this.firestore, `venues/${venueId}/visitsLog/${itemId}/visits`);
        const sortedVisits = query(itemVisitssRef, orderBy('timestamp'))
        return collectionData(sortedVisits)
    }

    async deleteItem(venueId: string, itemId: string) {
        const itemRef = doc(this.firestore, `venues/${venueId}/items/${itemId}`);
        return await deleteDoc(itemRef)
        // .then(res => console.log(res))
        // .catch(err => console.log(err));
    }

    updateAudioUrlFromDb(venueId: string, itemId: string, language: string) {
        console.log(venueId, itemId, language)
        const audioUrlRef = doc(this.firestore, `venues/${venueId}/items/${itemId}/languages/${language}`);
        return updateDoc(audioUrlRef, { audioUrl: null })

    }

    deleteAllItemsInVenue(venueId: string) {
        console.log(venueId)
        const subscription = this.readItems(venueId).subscribe((items: Item[]) => {
            const itemIds: string[] = [];
            items.forEach((item: Item) => {
                items.forEach((item: Item) => {
                    item.itemByLanguages.forEach((lsc: LSContent) => {

                        this.deleteAudioFilesFromStorage(venueId, item.id)

                    })
                })
                if (confirm(`delete item with id: ${item.id}`)) {
                    return this.deleteItem(venueId, item.id)
                }
                // this.deleteItem(venueId, item.id)
                // itemIds.push(item.id)
            })
            // console.log(itemIds);
            // itemIds.forEach((itemId: string) => {
            //     if (confirm(`delete item with id: ${itemId}`)) {
            //         return this.deleteItem(venueId, itemId)
            //     }


            // })
            subscription.unsubscribe();

        })
    }
    // deleteItem(venueId: string, itemId: string) {
    //     console.log(' deleting item')
    //     this.deleteAudioFilesFromStorage(venueId, itemId)
    // }
    deleteAudioFilesFromStorage(venueId, itemId) {
        this.getLanguagesSpecificContentByItemId(venueId, itemId)
            .subscribe((lssc: LSContent[]) => {
                const languages: string[] = [];
                console.log(lssc);
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


                // languages.forEach((language: string) => {
                //     if (confirm(`delete ${language} audio file`)) {
                //         this.updateItemAudioUrl(venueId, itemId, language, null)
                //             .then((res) => {
                //                 console.log(`${language} audio deleted from storage`)
                //             })
                //     }
                // })
            })
    }



    setLanguageToItem(venueId: string, itemId: string, language: string, languageContent: LSContent) {
        const languageContentRef = doc(this.firestore, `venues/${venueId}/items/${itemId}/languages/${language}`);
        return setDoc(languageContentRef, languageContent)
    }
    getLanguagesSpecificContentByItemId(venueId: string, itemId: string): Observable<any> {
        const languagesByItemIdRef = collection(this.firestore, `venues/${venueId}/items/${itemId}/languages`)
        return collectionData(languagesByItemIdRef)
    }

    getLSCbyLanguage(venueId: string, itemId: string, language: string) {
        console.log(venueId, itemId, language);
        const languageDataRef = doc(this.firestore, `venues/${venueId}/items/${itemId}/languages/${language}`)
        return docData(languageDataRef);
    }
    deleteLSC(venueId: string, itemId: string, language: string) {
        const deleteLSCRef = doc(this.firestore, `venues/${venueId}/items/${itemId}/languages/${language}`)
        return deleteDoc(deleteLSCRef)

    }
    getAvailableLanguages(venueId: string, itemId: string) {
        const getLanguagesRef = collection(this.firestore, `venues/${venueId}/items/${itemId}/languages`)
        return collectionData(getLanguagesRef)
    }
    updateItemAudioUrl(venueId: string, itemId: string, language: string, audioUrl: string) {
        const itemAudioUrl = doc(this.firestore, `venues/${venueId}/items/${itemId}/languages/${language}`);
        return updateDoc(itemAudioUrl, { audioUrl })
    }
    getAudioByLanguage(venueId: string, itemId: string, language: string) {
        const itemAudioUrl = doc(this.firestore, `venues/${venueId}/items/${itemId}/languages/${language}`);
        return docData(itemAudioUrl)
    }
    updateItemDescriptionByLanguage(venueId: string, itemId: string, language: string, description: string) {
        const descriptionRef = doc(this.firestore, `venues/${venueId}/items/${itemId}/languages/${language}`)
        return updateDoc(descriptionRef, { description })
    }
    udpdateItemNameByLanguage(venueId: string, itemId: string, language: string, name: string) {
        const itemNameRef = doc(this.firestore, `venues/${venueId}/items/${itemId}/languages/${language}`)
        return updateDoc(itemNameRef, { name })
    }
    updateMainPageProperty(venueId: string, itemId: string, status: boolean) {
        const itemRef = doc(this.firestore, `venues/${venueId}/items/${itemId}`)
        return updateDoc(itemRef, { isMainItem: status })
    }
    // CREATE ITEM
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
