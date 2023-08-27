import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { ItemDetailsDbService } from '../../../../services/item-details-db.service';
import { Venue, Item, Visit } from 'src/app/shared/item.model';
import { MatTableDataSource } from '@angular/material/table';
// import { VenuesService } from '../../../venues.service';
import * as fromAdmin from 'src/app/admin/store/admin.reducer';
import * as Admin from 'src/app/admin/store/admin.actions';
import { Store } from '@ngrx/store';
import { ItemDetailsDbService } from 'src/app/admin/services/item-details-db.service';
import { VenuesService } from 'src/app/admin/services/venues.service';

@Component({
    selector: 'app-item-stats',
    templateUrl: './item-stats.component.html',
    styleUrls: ['./item-stats.component.scss']
})
export class ItemStatsComponent implements OnInit {

    venue: Venue;
    item: Item;
    visits: Visit[];
    displayedColumns: string[] = ['date', 'liked', 'delete'];
    visitsDataSource: MatTableDataSource<any>

    constructor(
        private route: ActivatedRoute,
        private itemDetailsDbService: ItemDetailsDbService,
        private venuesService: VenuesService,
        private router: Router,
        private store: Store<fromAdmin.AdminState>,
    ) { }

    ngOnInit(): void {
        this.route.params.subscribe((params: any) => {
            const venueId = params.venueId;
            const itemId = params.itemId;
            // this.venuesService.readVenue(venueId).subscribe((venue: Venue) => {
            //     this.venue = venue;
            // })
            this.store.select(fromAdmin.getVenue).subscribe((venue: Venue) => {
                this.venue = venue;
            })
            // this.itemDetailsDbService.readItem(venueId, itemId)
            this.store.select(fromAdmin.getItem)
                .subscribe((item: Item) => {
                    this.item = item;
                })
            // console.log(venueId, itemId)
            this.itemDetailsDbService.readItemVisits(venueId, itemId)
                .subscribe((visits: Visit[]) => {
                    // console.log(visits)
                    this.visits = visits
                    this.visitsDataSource = new MatTableDataSource(visits)
                })
        })
    }
    onDeleteVisit(visitId: string) {
        // console.log(visitId)
        this.itemDetailsDbService.deleteVisit(this.venue.id, this.item.id, visitId)
            .then((res) => {
                // console.log(res, 'visit deleted')
            })
            .catch(err => console.log(err))
    }
    onBackToVenueDetails() {
        this.router.navigate(['admin/venue-details', { venueId: this.venue.id }])
    }

}
