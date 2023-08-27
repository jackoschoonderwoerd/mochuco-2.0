import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { VenuesComponent } from './venues/venues.component';
import { ItemComponent } from '../user/item/item.component';

import { QrCodeComponent } from './qr-code/qr-code.component';
import { VenueDetailsComponent } from './venues/venues-table/venue-details/venue-details.component';


import { AuthGuardService } from './auth/auth-guard.service';
import { AdminHomeComponent } from './admin-home/admin-home.component';
// import { LscDescriptionComponent } from './venues/venue-details/item-details/item-lsc/lsc-details/item-lsc-description/item-lsc-description.component';
// import { LscNameComponent } from './venues/venues-table/venue-details/items-table/item-details/item-lsc/lsc-details/item-lsc-name/item-lsc-name.component';
import { NewItemComponent } from './venues/venues-table/venue-details/new-item/new-item.component';
import { ErrPageComponent } from './shared/err-page/err-page.component';
// import { ItemLscDetailsComponent } from './venues/venues-table/venue-details/items-table/item-details/item-lsc/lsc-details/lsc-details.component';
import { VenueNameComponent } from './venues/venues-table/venue-details/venue-name/venue-name.component';
import { CoordinatesComponent } from './venues/venues-table/venue-details/items-table/item-details/coordinates/coordinates.component';
import { MainItemComponent } from './venues/venues-table/venue-details/items-table/item-details/main-item/main-item.component';
import { StatsComponent } from './venues/stats/stats.component';
import { ItemStatsComponent } from './venues/venues-table/venue-details/items-table/item-details/item-stats/item-stats.component';
import { AddPrefaceComponent } from './admin-home/add-preface/add-preface.component';
import { ItemDetailsComponent } from './venues/venues-table/venue-details/items-table/item-details/item-details.component';
import { LscDetailsComponent } from './venues/venues-table/venue-details/items-table/item-details/lsc-table/lsc-details/lsc-details.component';
import { LscDescriptionComponent } from './venues/venues-table/venue-details/items-table/item-details/lsc-table/lsc-details/lsc-description/lsc-description.component';
import { LscNameComponent } from './venues/venues-table/venue-details/items-table/item-details/lsc-table/lsc-details/lsc-name/lsc-name.component';
import { WindowStoreComponent } from './store/window-store/window-store.component';
// import { LscDetailsComponent } from './venues/venues-table/venue-details/items-table/item-details/lsc-table/item-lsc-details/lsc-details.component';
// import { LscDescriptionComponent } from './venues/venues-table/venue-details/items-table/item-details/lsc-table/item-lsc-details/item-lsc-description/item-lsc-description.component';
// import { LscNameComponent } from './venues/venues-table/venue-details/items-table/item-details/lsc-table/item-lsc-details/item-lsc-name/item-lsc-name.component';
// import { ItemLscDetailsComponent } from './venues/venues-table/venue-details/items-table/item-details/lsc-table/lsc-details/lsc-details.component';
// import { LscDescriptionComponent } from './venues/venues-table/venue-details/items-table/item-details/lsc-table/lsc-details/item-lsc-description/item-lsc-description.component';
// import { LscNameComponent } from './venues/venues-table/venue-details/items-table/item-details/lsc-table/lsc-details/item-lsc-name/item-lsc-name.component';
// import { LscDetailsComponent } from './venues/venues-table/venue-details/items-table/item-details/lsc-table/lsc-details/lsc-details.component';
// import { LscDescriptionComponent } from './venues/venues-table/venue-details/items-table/item-details/item-lsc/lsc-details/item-lsc-description/item-lsc-description.component';


const routes: Routes = [
    {
        path: '', component: AdminComponent,
        children: [
            {
                path: '', component: AdminHomeComponent,
            },
            {
                path: 'admin', component: AdminHomeComponent,
            },
            {
                path: 'admin-home', component: AdminHomeComponent
            },
            {
                path: 'add-preface', component: AddPrefaceComponent
            },
            {
                path: 'venues',
                component: VenuesComponent,
            },
            {
                path: 'venue-name',
                component: VenueNameComponent
            },
            {
                path: 'qr-code',
                component: QrCodeComponent
            },
            {
                path: 'stats',
                component: StatsComponent
            },
            {
                path: 'venue-details',
                component: VenueDetailsComponent
            },
            {
                path: 'new-item',
                component: NewItemComponent
            },
            {
                path: 'item-details',
                component: ItemDetailsComponent
            },
            {
                path: 'coordinates',
                component: CoordinatesComponent
            },
            {
                path: 'item-stats',
                component: ItemStatsComponent
            },
            {
                path: 'main-page',
                component: MainItemComponent
            },

            {
                path: 'lsc-details',
                component: LscDetailsComponent
            },
            {
                path: 'item-lsc-description',
                component: LscDescriptionComponent
            },
            {
                path: 'item-lsc-name',
                component: LscNameComponent
            },
            {
                path: 'err-page',
                component: ErrPageComponent
            },
            {
                path: 'window-store',
                component: WindowStoreComponent
            },
            {
                path: '**', component: AdminHomeComponent
            }
        ]
    },


];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule {

}
