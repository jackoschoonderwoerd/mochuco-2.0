import { Injectable } from '@angular/core';
import { ItemDetailsDbService } from './item-details-db.service';
import { MatSnackBar } from '@angular/material/snack-bar';
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

@Injectable({
    providedIn: 'root'
})
export class ItemDetailsStService {

    constructor(
        private storage: Storage,
        private itemDetailsDbService: ItemDetailsDbService,
        // private snackbar: MatSnackBar
    ) { }

    async storeItemImage(venueId: string, itemId: string, file: File) {
        console.log(`storeitemImage(){}`)
        if (venueId && itemId && file) {
            try {
                const path = `venues/${venueId}/items/${itemId}/itemImage`
                const storageRef = ref(this.storage, path);
                const task = uploadBytesResumable(storageRef, file);
                await task;
                const url = await getDownloadURL(storageRef)
                return url;
            } catch (e: any) {
                console.log(e);
            }
        } else {
            alert('insufficient data to store item image');
        }
    }
    deleteItemImageFile(venueId: string, itemId: string) {
        console.log(venueId, itemId);

        const imageRef = ref(this.storage, `venues/${venueId}/items/${itemId}/itemImage`);
        return getDownloadURL(imageRef)
            .then((res) => {
                console.log(res)
                return deleteObject(imageRef)
            })
            .catch(error => {
                if (error.code === 'storage/object-not-found') {
                    return Promise.resolve(false);
                } else {
                    return Promise.reject(error);
                }
            });
    }

    async storeAudio(venueId: string, itemId: string, language: string, file: File) {
        console.log(venueId, itemId, language, file);
        if (venueId && itemId && file) {
            try {
                const path = `venues/${venueId}/items/${itemId}/audio/${language}`
                const storageRef = ref(this.storage, path);
                const task = uploadBytesResumable(storageRef, file);
                await task;
                const url = await getDownloadURL(storageRef)
                console.log(url)
                return url;
            } catch (e: any) {
                console.log(e);
            }
        } else {
            alert('insufficient data to store item image');
        }
    }



    // deleteAudioFileAndUpdateUrl(venueId: string, itemId: string, language: string) {
    //     console.log(venueId, itemId, language);
    //     const audioRef = ref(this.storage, `venues/${venueId}/items/${itemId}/audio/${language}`)
    //     return deleteObject(audioRef)
    //         .then((res: any) => {
    //             console.log(`audiofile ${language} removed from storage`, 'OK')
    //             this.itemDetailsDbService.updateAudioUrlFromDb(venueId, itemId, language)
    //                 .then((res: any) => {
    //                     console.log(`audioUrl ${language} set to null`, 'OK');
    //                 })
    //                 .catch((err) => {
    //                     console.log(`failed to update audioUrl ${language} - ${err}`);
    //                 });
    //         })
    //         .catch((err) => {
    //             console.log('failed to remove audiofile for storage', 'OK')
    //         })
    // }
    // deleteAudioFile(venueId: string, itemId: string, language: string) {
    //     console.log(venueId, itemId, language);
    //     const audioRef = ref(this.storage, `venues/${venueId}/items/${itemId}/audio/${language}`)
    //     return deleteObject(audioRef)
    // }
}

