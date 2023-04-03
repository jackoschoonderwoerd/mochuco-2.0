import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
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
    where,
    increment
} from '@angular/fire/firestore';
import { Item } from 'src/app/shared/item.model';
import { LSContent } from '../../shared/item.model';
import { Venue } from '../../admin/venues/venues.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface ItemVisit {
    timestamp: number,
    liked: boolean;
    language?: string
    id?: string
}


@Injectable({
    providedIn: 'root'
})
export class ItemService {

    activeVisitId: string;

    private venueSubject = new BehaviorSubject<Venue>(null);
    public venue$ = this.venueSubject.asObservable();

    private itemSubject = new BehaviorSubject<Item>(null)
    public item$ = this.itemSubject.asObservable();

    private lscSubject = new BehaviorSubject<LSContent>(null)
    public lsc$ = this.lscSubject.asObservable();

    private activeLanguageSubject = new BehaviorSubject<string>('dutch')
    public activeLanguage$ = this.activeLanguageSubject.asObservable()

    private availableLanguagesSubject = new BehaviorSubject<string[]>(null);
    public availableLanguages$ = this.availableLanguagesSubject.asObservable()

    constructor(
        private firestore: Firestore,
    ) { }

    setVenueObservable(venueId: string) {
        const venueRef = doc(this.firestore, `venues/${venueId}`);
        return docData(venueRef)
            .subscribe((venue: Venue) => {
                this.venueSubject.next(venue);
            })
    }

    setItemObservable(venueId: string, itemId: string) {
        console.log(venueId, itemId);
        if (itemId != null) {

            this.addVisit(venueId, itemId);

            const itemRef = doc(this.firestore, `venues/${venueId}/items/${itemId}`)
            return docData(itemRef)
                .subscribe((item: Item) => {
                    console.log(item)
                    this.itemSubject.next(item);
                })
        }
    }

    setLscObservable(venueId: string, itemId: string, language: string) {
        console.log(venueId, itemId, language)
        // this.updateTimesVisited(venueId, itemId, language)
        // this.addVisit(venueId, itemId, language);
        const lscRef = doc(this.firestore, `venues/${venueId}/items/${itemId}/languages/${language}`)
        return docData(lscRef)
            .subscribe((lsc: LSContent) => {
                this.lscSubject.next(lsc);
            })
    }
    setAvailableLanguagesObservable(venueId: string, itemId: string, activeLanguage: string) {
        const languagesRef = collection(this.firestore, `venues/${venueId}/items/${itemId}/languages`)
        return collectionData(languagesRef).subscribe((lscs: LSContent[]) => {
            const availableLanguages: string[] = [];
            lscs.forEach((lsc: LSContent) => {
                availableLanguages.push(lsc.language);
                // const availableLanguagesMinusActiveLanguage:string[] = []
                const availableLanguagesMinusActiveLanguage = availableLanguages.filter((availableLanguage: string) => {
                    return availableLanguage != activeLanguage;
                })
                // this.availableLanguagesSubject.next(availableLanguages)
                this.availableLanguagesSubject.next(availableLanguagesMinusActiveLanguage)
            })
        })
    }
    setActiveLanguage(language: string) {
        this.activeLanguageSubject.next(language);
    }
    getMainItem(venueId): Observable<any> {
        console.log('get main item')
        const itemsRef = collection(this.firestore, `venues/${venueId}/items`);
        const mainItemQuery = query(itemsRef, where('isMainItem', '==', true))
        return collectionData(mainItemQuery, { idField: 'id' })
    }

    addVisit(venueId: string, itemId: string) {
        const itemVisit: ItemVisit = {
            timestamp: new Date().getTime(),
            liked: false,

        }
        // console.log(itemVisit)
        const visitRef = collection(this.firestore, `venues/${venueId}/visitsLog/${itemId}/visits`)
        return addDoc(visitRef, itemVisit)
            .then((docRef: any) => {
                console.log(docRef.id)
                this.activeVisitId = docRef.id
            })
            .catch(err => {
                console.log(err);
            })
    }

    like(venueId: string, itemId: string) {
        // this.activeVisitId$.subscribe((visitId: string) => {
        console.log(venueId);
        console.log(itemId);
        // console.log(visitId);
        const visitRef = doc(this.firestore, `venues/${venueId}/visitsLog/${itemId}/visits/${this.activeVisitId}`);
        return updateDoc(visitRef, { liked: true })
            .then((res: any) => console.log('item liked'))
            .catch(err => console.error(err));
        // })
    }
}
