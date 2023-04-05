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
import { ItemDetailsDbService } from 'src/app/admin/venues/venue-details/item-details/item-details-db.service';

export interface ItemVisit {
    timestamp: number,
    liked: boolean;
    language?: string
    id?: string
}

export interface IdLatLon {
    id: string;
    lat: number;
    lon: number;
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
    public availableLanguages$ = this.availableLanguagesSubject.asObservable();

    private collectingLscDataSubject = new BehaviorSubject<boolean>(false);
    public collectingLscData$ = this.collectingLscDataSubject.asObservable();

    private collectingItemDataSubject = new BehaviorSubject<boolean>(false)
    public collectingItemData$ = this.collectingItemDataSubject.asObservable();

    constructor(
        private firestore: Firestore,
        private itemDetailsDbService: ItemDetailsDbService
    ) { }

    setVenueObservable(venueId: string) {
        console.log('setVenueObservable(){}')
        const venueRef = doc(this.firestore, `venues/${venueId}`);
        return docData(venueRef, { idField: 'id' })
            .subscribe((venue: Venue) => {
                this.venueSubject.next(venue);
            })
    }

    setItemObservable(venueId: string, itemId: string) {
        this.collectingItemDataSubject.next(true)
        console.log('setItemObservable(){}', venueId, itemId);
        if (itemId != null) {

            this.addVisit(venueId, itemId);

            const itemRef = doc(this.firestore, `venues/${venueId}/items/${itemId}`)
            return docData(itemRef, { idField: 'id' })
                .subscribe((item: Item) => {
                    this.collectingItemDataSubject.next(false)
                    this.itemSubject.next(item);
                })
        }
    }

    setLscObservable(venueId: string, itemId: string, language: string) {
        this.collectingLscDataSubject.next(true);
        console.log('setLscObservable(){}', venueId, itemId, language)
        // this.updateTimesVisited(venueId, itemId, language)
        // this.addVisit(venueId, itemId, language);
        const lscRef = doc(this.firestore, `venues/${venueId}/items/${itemId}/languages/${language}`)
        docData(lscRef)
            .subscribe((lsc: LSContent) => {
                if (lsc != undefined) {
                    console.log(lsc.name);
                    this.collectingLscDataSubject.next(false);
                    this.lscSubject.next(lsc);
                }
            })
    }

    setAvailableLanguagesObservable(venueId: string, itemId: string, activeLanguage: string) {
        console.log('setAvailableLanguagesObservable(){}', venueId, itemId, activeLanguage);
        const languagesRef = collection(this.firestore, `venues/${venueId}/items/${itemId}/languages`)
        collectionData(languagesRef).subscribe((lscs: LSContent[]) => {
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
        console.log(language);
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
                this.activeVisitId = docRef.id
            })
            .catch(err => {
                console.log(err);
            })
    }

    like(venueId: string, itemId: string) {
        const visitRef = doc(this.firestore, `venues/${venueId}/visitsLog/${itemId}/visits/${this.activeVisitId}`);
        return updateDoc(visitRef, { liked: true })
            .then((res: any) => console.log('item liked'))
            .catch(err => console.error(err));
    }

    findNearestItem(venueId) {
        return this.itemDetailsDbService.readItems(venueId).subscribe((items: Item[]) => {
            const idLatLons: IdLatLon[] = [];
            items.forEach((item: Item) => {
                const idLatLon: IdLatLon = {
                    id: item.id,
                    lat: parseFloat(item.latitude),
                    lon: parseFloat(item.longitude)
                }
                idLatLons.push(idLatLon);
            })
            this.porcessIdLatLons(idLatLons, venueId)
        })
    }
    porcessIdLatLons(idLatLons: IdLatLon[], venueId) {
        if (navigator) {
            console.log('navigator found')
            navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
                if (position) {
                    const userLat = position.coords.latitude;
                    const userLon = position.coords.longitude;
                    let idLatLonDists = []
                    idLatLons.forEach((idLatLon) => {
                        const userDistanceToItem = Math.round(this.distanceFromObject(
                            userLat,
                            userLon,
                            idLatLon.lat,
                            idLatLon.lon
                        ))
                        idLatLonDists.push({
                            id: idLatLon.id,
                            distance: userDistanceToItem
                        });
                        idLatLonDists = idLatLonDists.sort((a, b) => {
                            return a.distance - b.distance
                        })
                    })
                    const idNearestItem = idLatLonDists[0].id
                    this.setItemObservable(venueId, idNearestItem);
                    this.activeLanguage$.subscribe((language: string) => {
                        console.log('called from item.service.ts');
                        this.setLscObservable(venueId, idNearestItem, language)
                        this.setAvailableLanguagesObservable(venueId, idNearestItem, language)
                    })
                } else {
                    console.log('no position')
                }
            })
        } else {
            console.log('no navigator')
        }
    }

    distanceFromObject(latObject: number, lonObject: number, latVisitor: number, lonVisitor: number) {  // generally used geo measurement function
        var R = 6378.137; // Radius of earth in KM
        var dLat = latVisitor * Math.PI / 180 - latObject * Math.PI / 180;
        var dLon = lonVisitor * Math.PI / 180 - lonObject * Math.PI / 180;
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(latObject * Math.PI / 180) * Math.cos(latVisitor * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d * 1000; // meters
    }
}
