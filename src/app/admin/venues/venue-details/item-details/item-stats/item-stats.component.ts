import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemDetailsDbService } from '../item-details-db.service';
import { Item, Visit } from 'src/app/shared/item.model';
import { MatTableDataSource } from '@angular/material/table';
import { Venue, VenuesService } from '../../../venues.service';

@Component({
    selector: 'app-item-stats',
    templateUrl: './item-stats.component.html',
    styleUrls: ['./item-stats.component.scss']
})
export class ItemStatsComponent implements OnInit {

    venue: Venue;
    item: Item;
    visits: Visit[];
    displayedColumns: string[] = ['date', 'liked'];
    visitsDataSource: MatTableDataSource<any>

    constructor(
        private route: ActivatedRoute,
        private itemDetailsDbService: ItemDetailsDbService,
        private venuesService: VenuesService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.route.params.subscribe((params: any) => {
            const venueId = params.venueId;
            const itemId = params.itemId;
            this.venuesService.readVenue(venueId).subscribe((venue: Venue) => {
                this.venue = venue;
            })
            this.itemDetailsDbService.readItem(venueId, itemId)
                .subscribe((item: Item) => {
                    this.item = item;
                })
            console.log(venueId, itemId)
            this.itemDetailsDbService.readItemVisits(venueId, itemId)
                .subscribe((visits: Visit[]) => {
                    console.log(visits)
                    this.visits = visits
                    this.visitsDataSource = new MatTableDataSource(visits)
                })
        })
    }
    onBackToVenueDetails() {
        this.router.navigate(['admin/venue-details', { venueId: this.venue.id }])
    }

}
