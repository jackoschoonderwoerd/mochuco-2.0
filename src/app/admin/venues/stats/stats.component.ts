import { Component, OnInit } from '@angular/core';
import { VenuesService } from '../venues.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-stats',
    templateUrl: './stats.component.html',
    styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {

    stats: any

    constructor(
        private venuesService: VenuesService,
        private route: ActivatedRoute) { }

    ngOnInit(): void {
        this.route.params.subscribe((params: any) => {
            const venueId = params.venueId;
            console.log(venueId);
            this.venuesService.readStats(venueId).subscribe((stats: any) => {
                console.log(stats);
                this.stats = stats
            })
        })
    }
}
