import { Injectable } from '@angular/core';
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
import { Store } from '@ngrx/store';
import * as fromAdmin from '../store/admin.reducer';
import * as Admin from './../store/admin.actions'
import { Item, LSContent, Venue } from 'src/app/shared/item.model';
import { Router } from '@angular/router';
import { getAdminState, AdminState } from '../store/admin.reducer';

@Injectable({
    providedIn: 'root'
})
export class LscService {

    private languageOptions: string[] = ['dutch', 'english', 'german'];

    constructor(
        private firestore: Firestore,
        private storage: Storage,
        private store: Store,
        private router: Router

    ) { }

    getLSCbyLanguage(venueId: string, itemId: string, language: string): void {
        console.log(venueId, itemId, language);
        const languageDataRef = doc(this.firestore, `venues/${venueId}/items/${itemId}/languages/${language}`)
        docData(languageDataRef).subscribe((lSContent: LSContent) => {
            this.store.dispatch(new Admin.SetLanguageSpecificContent(lSContent))
        })
        // return docData(languageDataRef);
    }

    udpdateLscName(venueId: string, itemId: string, language: string, name: string) {
        console.log(venueId, itemId, language, name);
        const itemNameRef = doc(this.firestore, `venues/${venueId}/items/${itemId}/languages/${language}`)
        return updateDoc(itemNameRef, { name })
        // .then(() => {
        // this.store.select(fromAdmin.getLanguages).subscribe((lssc: LSContent[]) => {
        //     const index = lssc.findIndex((lsc: LSContent) => {
        //         return lsc.language === language
        //     })
        //     console.log(index)
        //     const newLssc: LSContent[] = { ...lssc }
        //     newLssc[index].name = name
        //     this.store.dispatch(new Admin.SetLanguagesSpecificContent(newLssc))

        // })
        // this.store.select(fromAdmin.getLanguage).subscribe((lsc: LSContent) => {
        //     const newLsc: LSContent = { ...lsc }
        //     newLsc.name = name
        //     this.store.dispatch(new Admin.SetLanguageSpecificContent(newLsc))
        // })
        // })
    }

    deleteLSC(venueId: string, itemId: string, language: string) {
        // 1 delete audiofile from storage
        // 2 delete lsc from db
        const lscRef = doc(
            this.firestore,
            `venues/${venueId}/items/${itemId}/languages/${language}`
        );
        return deleteDoc(lscRef).then((res) => {
            this.removeLscFromStore(language)
        })
    }
    removeLscFromStore(language: string) {
        // this.store.select(fromAdmin.getLanguages).subscribe((lscs: LSContent[]) => {
        //     const index = lscs.findIndex((lsc: LSContent) => {
        //         return lsc.language == language
        //     })
        //     console.log(index)
        //     const updatedLscs = lscs.splice(index, 1)
        //     this.store.dispatch(new Admin.SetLanguagesSpecificContent(updatedLscs))
        // })
    }


    addLscName(venueId, itemId, language, lsc: LSContent) {
        console.log(venueId, itemId, language, lsc)


        const languageContentRef = doc(this.firestore, `venues/${venueId}/items/${itemId}/languages/${language}`);

        setDoc(languageContentRef, lsc)
            .then((data) => {
                console.log(data)
                this.store.dispatch(new Admin.SetLanguageSpecificContent(lsc))

                const adminState: AdminState = JSON.parse(localStorage.getItem('adminState'))
                console.log(adminState)
                adminState.languagesSpecificContent.push(lsc)
                this.store.dispatch(new Admin.SetLanguagesSpecificContent(adminState.languagesSpecificContent))


                // this.store.select(fromAdmin.getLanguages).subscribe((lscs: LSContent[]) => {
                //     const updatedLscs = { ...lscs }
                //     this.store.dispatch(new Admin.SetLanguagesSpecificContent(updatedLscs))
                // })
                this.router.navigate(['admin/lsc-details', {
                    venueId,
                    itemId,
                    language
                }])
            })
            .catch((err) => {
                console.log('unable to setDoc lsc', err)
            })

    }

    updateLscDescription(venueId: string, itemId: string, language: string, description: string): void {
        console.log(
            venueId,
            itemId,
            language,
            description
        )
        const descriptionRef = doc(this.firestore, `venues/${venueId}/items/${itemId}/languages/${language}`)
        updateDoc(descriptionRef, { description }).then((res) => {
            this.updateStoreLscDescription(
                venueId,
                itemId,
                language,
                description)
        }).catch((err) => {
            alert(`unable to update description, ${err}`);
        });
    }

    updateStoreLscDescription(venueId: string, itemId: string, language: string, description: string): void {
        const adminState: AdminState = JSON.parse(localStorage.getItem('adminState'))
        const updatedLsc = adminState.languageSpecificContent;
        updatedLsc.description = description
        this.store.dispatch(new Admin.SetLanguageSpecificContent(updatedLsc));

        this.updateStoreLscs(venueId, itemId, language, updatedLsc)
    }

    updateStoreLscs(venueId, itemId, language, updatedLsc) {
        const adminState: AdminState = JSON.parse(localStorage.getItem('adminState'))
        const index = adminState.languagesSpecificContent.findIndex((updatedLsc: LSContent) => {
            return updatedLsc.language == language
        })
        adminState.languagesSpecificContent[index] = updatedLsc
        this.store.dispatch(new Admin.SetLanguagesSpecificContent(adminState.languagesSpecificContent));
        this.router.navigate(['/admin/lsc-details', { venueId, itemId, language }])
    }

    deleteAudioFileAndUpdateUrl(venueId: string, itemId: string, language: string) {
        console.log(venueId, itemId, language);
        const audioRef = ref(this.storage, `venues/${venueId}/items/${itemId}/audio/${language}`)
        return deleteObject(audioRef)
            .then((res: any) => {
                console.log(`audiofile ${language} removed from storage`, 'OK')
                this.updateAudioUrlFromDb(venueId, itemId, language)
                    .then((res: any) => {
                        console.log(`audioUrl ${language} set to null`, 'OK');
                    })
                    .catch((err) => {
                        console.log(`failed to update audioUrl ${language} - ${err}`);
                    });
            })
            .catch((err) => {
                console.log('failed to remove audiofile for storage', 'OK')
            })
    }

    getLscs(venueId: string, itemId: string) {
        const lscsRef = collection(this.firestore, `venues/${venueId}/items/${itemId}/languages`)

        // return collectionData(lscsRef)
        collectionData(lscsRef).subscribe((lscs: LSContent[]) => {
            this.store.dispatch(new Admin.SetLanguagesSpecificContent(lscs))
        })
    }

    deleteAudioFile(venueId: string, itemId: string, language: string) {
        const audioFileRef = ref(this.storage, `venues/${venueId}/items/${itemId}/audio/${language}`)
        const promise = new Promise((resolve, reject) => {
            getDownloadURL(audioFileRef).then((url: string) => {
                if (url) {
                    console.log(`file exists`)
                    resolve(deleteObject(audioFileRef))
                } else {
                    console.log(`no lsc audio file`)
                }
            })
        })
        return promise
    }

    updateAudioUrlFromDb(venueId: string, itemId: string, language: string) {
        // console.log(venueId, itemId, language)
        const audioUrlRef = doc(this.firestore, `venues/${venueId}/items/${itemId}/languages/${language}`);
        return updateDoc(audioUrlRef, { audioUrl: null })

    }
    getAvailableLanguages() {
        // const promise = new Promise((resolve, reject) => {

        //     this.store.select(fromAdmin.getVenue).subscribe((venue: Venue) => {
        //         this.store.select(fromAdmin.getItem).subscribe((item: Item) => {
        //             const availableLanguages: string[] = [];
        //             const languagesTaken: string[] = []
        //             this.getLscs(venue.id, item.id)
        //                 .subscribe((lscs: LSContent[]) => {
        //                 console.log(lscs);
        //                 lscs.forEach((lsc: LSContent) => {
        //                     languagesTaken.push(lsc.language)
        //                 })
        //                 this.languageOptions.forEach((languageOption: string) => {
        //                     if (!languagesTaken.includes(languageOption)) {
        //                         availableLanguages.push(languageOption)
        //                     }
        //                     resolve(availableLanguages)
        //                 })
        //             })
        //         })
        //     })
        // })
        // return promise
    }

}
