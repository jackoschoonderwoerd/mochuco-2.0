import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
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
import { Venue, LSContent } from '../../shared/item.model';

import { Router } from '@angular/router';

export interface ItemVisit {
    timestamp: number,
    liked: boolean;
    language?: string
    id?: string
}

export interface IdLatLon {
    id: string;
    name: string
    lat: number;
    lon: number;
}

export interface PreviouslyVisitedItem {
    id: string;
    timestamp: number;
}
export interface ItemIdNameDistance {
    name: string,
    id: string,
    distance: number,
    isMainItem?: boolean
}


@Injectable({
    providedIn: 'root'
})
export class ItemService {

    activeVisitId: string;
    defaultLanguage: string = 'dutch'

    private venueSubject = new BehaviorSubject<Venue>(null);
    public venue$ = this.venueSubject.asObservable();

    private itemSubject = new BehaviorSubject<Item>(null)
    public item$ = this.itemSubject.asObservable();

    private lscSubject = new BehaviorSubject<LSContent>(null)
    public lsc$ = this.lscSubject.asObservable();

    private activeLanguageSubject = new BehaviorSubject<string>(this.defaultLanguage)
    public activeLanguage$ = this.activeLanguageSubject.asObservable()

    private availableLanguagesSubject = new BehaviorSubject<string[]>(null);
    public availableLanguages$ = this.availableLanguagesSubject.asObservable();

    private collectingLscDataSubject = new BehaviorSubject<boolean>(false);
    public collectingLscData$ = this.collectingLscDataSubject.asObservable();

    private collectingItemDataSubject = new BehaviorSubject<boolean>(false)
    public collectingItemData$ = this.collectingItemDataSubject.asObservable();

    private itemsNameAndDistanceSubject = new BehaviorSubject<any>(null)
    public itemsNameAndDistance$ = this.itemsNameAndDistanceSubject.asObservable();

    private selectableLanguagesSubject = new BehaviorSubject<string[]>(null);
    public selectableLanguages$ = this.selectableLanguagesSubject.asObservable();

    private orderedItemsIdNameSubject = new BehaviorSubject<ItemIdNameDistance[]>(null);
    public orderedItemsIdName$ = this.orderedItemsIdNameSubject.asObservable();


    previouslyVisitedItems: PreviouslyVisitedItem[] = []
    languageAvailable: boolean = false;


    constructor(
        private firestore: Firestore,
        private router: Router
    ) { }


    readVenue(venueId) {
        // console.log('readVenue: ', venueId)
        const venueRef = doc(this.firestore, `venues/${venueId}`);
        return docData(venueRef, { idField: 'id' })
    }
    readItems(venueId) {
        // console.log('readItems: ', venueId)
        const itemsRef = collection(this.firestore, `venues/${venueId}/items`);
        return collectionData(itemsRef, { idField: 'id' });
    }
    readItem(venueId, itemId) {
        // console.log('readItem:', venueId, itemId)
        // console.log(venueId, itemId);
        const itemRef = doc(this.firestore, `venues/${venueId}/items/${itemId}`)
        return docData(itemRef, { idField: 'id' })
    }
    readLanguages(venueId, itemId) {
        const languagesRef = collection(this.firestore, `venues/${venueId}/items/${itemId}/languages`)
        return collectionData(languagesRef)
    }

    async setObservables(venueId: string, itemId?: string) {
        // console.log('setObservables(){} ', venueId, itemId);
        if (!venueId) {
            // console.log('no no venueId')
        } else if (venueId && !itemId) {
            console.log(venueId, 'no itemId, looking for nearest')
            this.findAndSortAllItems(venueId)
            this.setVenueObservable(venueId)
            this.setItemObservable(venueId)
            this.nearestItem(venueId).then((nearestItem: Item) => {
                this.checkAvailability(venueId, nearestItem.id).then((isAvailable: boolean) => {
                    if (isAvailable) {
                        // console.log(venueId, 'no itemId, looking for nearest, language available')
                        // console.log(nearestItem);
                        const nearestItemId = nearestItem.id;
                        this.setItemObservable(venueId, nearestItemId)
                        this.setLscObservable(venueId, nearestItemId)
                    } else {
                        if (confirm('not available in selected language, reverting do default')) {
                            // console.log(venueId, 'no itemId, looking for nearest, language not available reverting to default language')
                            this.setActiveLanguage(this.defaultLanguage)
                            this.setItemObservable(venueId, nearestItem.id)
                            this.setLscObservable(venueId, nearestItem.id)

                        }
                    }
                })
            })
        } else {
            // console.log('venueId and itemId present', venueId, itemId)
            await this.checkAvailability(venueId, itemId).then((isAvailable: boolean) => {
                if (isAvailable) {
                    // console.log('venueId and itemId present language available', venueId, itemId)
                    this.setVenueObservable(venueId)
                    this.findAndSortAllItems(venueId);
                    this.setItemObservable(venueId, itemId);
                    this.setLscObservable(venueId, itemId);
                } else {
                    // console.log('venueId and itemId present language NOT available reverting to default', venueId, itemId)
                    if (confirm('not available in selected language, reverting do default')) {
                        this.setActiveLanguage(this.defaultLanguage);
                        this.setVenueObservable(venueId)
                        this.findAndSortAllItems(venueId);
                        this.setItemObservable(venueId, itemId);
                        this.setLscObservable(venueId, itemId);
                    }
                }
            })
        }
    }



    private checkAvailability(venueId, itemId) {
        // console.log('checkAvailability(){}')
        var isAvailable = new Promise((resolve, reject) => {

            const sub = this.activeLanguage$.subscribe((language: string) => {
                return this.readLanguages(venueId, itemId).subscribe((lscs: LSContent[]) => {
                    // console.log('checkAvailability(){} lscs: ', lscs);
                    // console.log('checkAvailability(){} language: ', language)
                    const availableLscs = lscs.filter((lsc: LSContent) => {
                        return lsc.language === language
                    })
                    // console.log(availableLscs.length)
                    if (availableLscs.length > 0) {
                        resolve(true)
                    } else {
                        resolve(false)

                    }
                })
            })
            sub.unsubscribe();
        })
        return isAvailable
    }


    setVenueObservable(venueId: string) {
        if (!venueId) {
            this.router.navigate(['user/user-error-page', { message: 'no venueId' }])
        } else {
            this.readVenue(venueId).subscribe((venue: Venue) => {
                this.venueSubject.next(venue)
            })
        }
    }

    setItemObservable(venueId: string, itemId?: string,) {
        // console.log('setItemObservable(){}: ', venueId, itemId);
        this.collectingItemDataSubject.next(true)
        this.readItem(venueId, itemId).subscribe((item: Item) => {
            // console.log(item)
            this.itemSubject.next(item);
            this.collectingItemDataSubject.next(false)
            this.router.navigateByUrl('user');
            this.addVisit(venueId, itemId)
        })
    }


    setLscObservable(venueId, itemId: string) {
        // console.log('setLscObservable(){} ', venueId, itemId);
        this.setSelectableLanguagesSubject(venueId, itemId)
        this.activeLanguage$.subscribe((activeLanguage: string) => {
            // console.log(activeLanguage)
            const lscRef = doc(this.firestore, `venues/${venueId}/items/${itemId}/languages/${activeLanguage}`)
            // console.log(venueId, itemId);
            docData(lscRef).subscribe((language: LSContent) => {
                this.lscSubject.next(language);
                this.collectingLscDataSubject.next(false);
            })
        })
        // this.getActiveLanguage().then((activeLanguage: string) => {
        //     console.log(activeLanguage)
        //     const lscRef = doc(this.firestore, `venues/${venueId}/items/${itemId}/languages/${activeLanguage}`)
        //     console.log(venueId, itemId);
        //     docData(lscRef).subscribe((lsc: LSContent) => {
        //         this.lscSubject.next(lsc);
        //         this.collectingLscDataSubject.next(false);
        //     })
        // })
    }


    setSelectableLanguagesSubject(venueId: string, itemId: string) {
        // console.log('setSelectableLanguagesSubject(){} ', venueId, itemId);
        const lscsRef = collection(this.firestore, `venues/${venueId}/items/${itemId}/languages`)
        collectionData(lscsRef).subscribe((lscs: LSContent[]) => {
            const usedLanguages: string[] = [];
            lscs.forEach((lsc: LSContent) => {
                usedLanguages.push(lsc.language);
                this.activeLanguage$.subscribe((activeLanguage: string) => {
                    const selectableLanguages = usedLanguages.filter((selsectableLanguage: string) => {
                        return selsectableLanguage != activeLanguage
                    })
                    this.selectableLanguagesSubject.next(selectableLanguages);
                })
            })
        })
        // sub.unsubscribe()
    }

    itemsDistances(venueId: string) {
        // console.log('itemsDistances(){}')
        var barTwo = new Promise((res, reject) => {
            this.readItems(venueId).subscribe((items: Item[]) => {
                const itemsIdNameDistance: ItemIdNameDistance[] = []
                if (items) {
                    var bar = new Promise((resolve, reject) => {
                        items.forEach((item: Item, index, array) => {
                            this.getDistanceFromUser(item.latitude, item.longitude)
                                .subscribe((distance: number) => {
                                    itemsIdNameDistance.push({
                                        name: item.name,
                                        id: item.id,
                                        distance: distance
                                    })
                                    if (index <= 0) {
                                        resolve(itemsIdNameDistance)
                                    } else {

                                    }
                                })
                        })
                    })
                    res(bar)
                }
            })
        })
        return barTwo
    }
    sortItemsDistances(venueId) {
        // console.log('sortItemsDistances(){}')
        const itemsDistancesPr = new Promise((resolve, reject) => {
            this.itemsDistances(venueId).then((itemsDistances: any) => {
                itemsDistances.sort((a, b) => {
                    if (a.distance < b.distance) {
                        return -1
                    }
                    if (a.distance > b.distance) {
                        return 1
                    }
                    // console.log(0)
                    return 0
                })
                resolve(itemsDistances)
            })
        })
        return itemsDistancesPr
    }

    private nearestItem(venueId) {
        // console.log('nearestItem(){}')
        const nearest = new Promise((resolve, reject) => {
            this.sortItemsDistances(venueId).then((sortedItems: Item[]) => {
                resolve(sortedItems[0])
            })
        })
        return nearest
    }

    private findAndSortAllItems(venueId: string) {
        // console.log('findAndSortAllItems(){}')
        this.readItems(venueId).subscribe((items: Item[]) => {
            const itemsIdNameDistance: ItemIdNameDistance[] = []
            if (items) {
                var bar = new Promise((resolve, reject) => {
                    items.forEach((item: Item, index, array) => {
                        this.getDistanceFromUser(item.latitude, item.longitude)
                            .subscribe((distance: number) => {
                                itemsIdNameDistance.push({
                                    name: item.name,
                                    id: item.id,
                                    distance: distance,
                                    isMainItem: item.isMainItem
                                })
                                if (index <= 0) {
                                    resolve(itemsIdNameDistance)
                                } else {

                                }
                            })
                    })
                })
                bar.then((itemsIdNameDistance: ItemIdNameDistance[]) => {
                    itemsIdNameDistance = this.sortItemsIdNameDistance(itemsIdNameDistance)
                    // console.log(itemsIdNameDistance);
                    this.orderedItemsIdNameSubject.next(itemsIdNameDistance);
                    // this.idNearestItemSubject.next(itemsIdNameDistance[0].id)
                })
            }
        })
    }

    private sortItemsIdNameDistance(itemsIdNameDistance: ItemIdNameDistance[]) {
        // console.log('sortItemsIdNameDistance(){}')
        itemsIdNameDistance = this.removeMainItem(itemsIdNameDistance)
        itemsIdNameDistance.sort((a, b) => {
            if (a.distance < b.distance) {
                return -1
            }
            if (a.distance > b.distance) {
                return 1
            }
            // console.log(0)
            return 0
        })
        return itemsIdNameDistance
    }

    private removeMainItem(itemsNameAndDistances: ItemIdNameDistance[]) {
        // console.log('removeMainItem: ', itemsNameAndDistances)
        const itemsMainRemoved = itemsNameAndDistances.filter((item: ItemIdNameDistance) => {
            return !item.isMainItem == true
        })
        // console.log('itemsMainRemoved: ', itemsMainRemoved)
        return itemsMainRemoved;
    }

    private getDistanceFromUser(itemLatitude: number, itemLongitude: number) {
        // console.log('getDistanceFromUser(){}')
        if (!navigator) {
            this.router.navigate(['/user/user-error-page', { message: 'no navigator' }])
        } else {
            const distanceToObject = new Observable(observer => {
                navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
                    if (!position) {
                        this.router.navigate(['/user/user-error-page', { message: 'can\'t determinate users geolocation' }])
                    } else {
                        const userLat = position.coords.latitude;
                        const userLon = position.coords.longitude;
                        const distanceFromObject = this.distanceFromObject(userLat, userLon, itemLatitude, itemLongitude);
                        observer.next(distanceFromObject);
                        observer.complete();
                    }
                })
            })

            return distanceToObject
        }
    }


    setActiveLanguage(language: string) {
        // console.log('setActiveLanguage: ', language);
        this.activeLanguageSubject.next(language);
    }

    getActiveLanguage() {
        // console.log('getActiveLanguage')
        const activeLanguagePr = new Promise((resolve, reject) => {
            this.activeLanguage$.subscribe((activeLanguage: string) => {
                // console.log(activeLanguage)
                resolve(activeLanguage)
            })
        })
        return activeLanguagePr
    }

    getVenueId(): Promise<any> {
        // console.log('getVenueId(){}')
        const venueIdPr = new Promise((resolve, reject) => {
            this.venue$.subscribe((venue: Venue) => {
                resolve(venue.id)
            })
        })
        return venueIdPr
    }

    getMainiItemId(): Promise<string> {
        // console.log('getMainItemId(){}')
        const mainItemIdPr = new Promise<string>((resolve, reject) => {
            this.venue$.subscribe((venue: Venue) => {

                this.readItems(venue.id).subscribe((items: Item[]) => {
                    const mainItems = items.filter((item: Item) => {
                        return item.isMainItem
                    })
                    const mainItem = (mainItems[0])
                    // console.log(mainItem.id)
                    resolve(mainItem.id)
                })
            })
        })
        return mainItemIdPr
    }

    setMainItem(): void {
        // console.log('setMainItem(){}')
        const sub = this.venue$.subscribe((venue: Venue) => {
            this.readItems(venue.id).subscribe((items: Item[]) => {
                const mainItems: Item[] = items.filter((item: Item) => {
                    return item.isMainItem == true
                })
                const mainItem = mainItems[0]
                // console.log(mainItem)
                this.setObservables(venue.id, mainItem.id)
            })
            sub.unsubscribe();
        })
    }


    addVisit(venueId: string, itemId: string) {
        const itemVisit: ItemVisit = {
            timestamp: new Date().getTime(),
            liked: false,
        }
        const visitRef = collection(this.firestore, `venues/${venueId}/visitsLog/${itemId}/visits`)
        addDoc(visitRef, itemVisit)
            .then((docRef: any) => {
                this.activeVisitId = docRef.id;
                console.log('visit added')
            })
            .catch(err => {
                // console.log(err);
            })
    }

    like() {
        const likePr = new Promise((resolve, reject) => {
            const sub = this.venue$.subscribe((venue: Venue) => {
                const subTwo = this.item$.subscribe((item: Item) => {
                    const visitRef = doc(this.firestore, `venues/${venue.id}/visitsLog/${item.id}/visits/${this.activeVisitId}`);
                    // const visitRef = doc(this.firestore, `venues/${venue.id}/visitsLog/${item.id}/visits/123`);
                    // return updateDoc(visitRef, { liked: true })
                    resolve(updateDoc(visitRef, { liked: true }))
                })
                subTwo.unsubscribe();
            })
            sub.unsubscribe();
        })
        return likePr
    }

    findNearestItem(venueId) {
        // console.log('findNearestItem(){}', venueId);
        // this.collectingItemDataSubject.next(true);
        // this.collectingLscDataSubject.next(true);
        // return this.itemDetailsDbService.readItems(venueId).subscribe((items: Item[]) => {
        //     const idLatLons: IdLatLon[] = [];
        //     items.forEach((item: Item) => {
        //         const idLatLon: IdLatLon = {
        //             id: item.id,
        //             name: item.name,
        //             lat: parseFloat(item.latitude),
        //             lon: parseFloat(item.longitude)
        //         }
        //         idLatLons.push(idLatLon);
        //     })
        //     this.processIdLatLons(idLatLons, venueId)

        // })
    }

    private processIdLatLons(idLatLons: IdLatLon[], venueId) {
        // if (navigator) {
        //     navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
        //         if (position) {
        //             const userLat = position.coords.latitude;
        //             const userLon = position.coords.longitude;
        //             let idNameLatLonDists = []
        //             idLatLons.forEach((idLatLon) => {
        //                 const userDistanceToItem = Math.round(this.distanceFromObject(
        //                     userLat,
        //                     userLon,
        //                     idLatLon.lat,
        //                     idLatLon.lon
        //                 ))
        //                 idNameLatLonDists.push({
        //                     id: idLatLon.id,
        //                     name: idLatLon.name,
        //                     distance: userDistanceToItem
        //                 });
        //                 idNameLatLonDists = idNameLatLonDists.sort((a, b) => {
        //                     return a.distance - b.distance
        //                 })
        //             })
        //             // // console.log(idNameLatLonDists);
        //             this.itemsNameAndDistanceSubject.next(idNameLatLonDists);
        //             const idNearestItem = idNameLatLonDists[0].id
        //             this.setItemObservable(venueId, idNearestItem);

        //             this.activeLanguage$.subscribe((language: string) => {
        //                 // // // console.log('called from item.service.ts');
        //                 this.setLscObservable(venueId, idNearestItem)
        //                 this.setSelectableLanguagesSubject(venueId, idNearestItem);
        //             })
        //         } else {
        //             // // // console.log('no position')
        //         }
        //     })
        // } else {
        //     // // // console.log('no navigator')
        // }
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
        return Math.round(d * 1000); // meters
    }
}
