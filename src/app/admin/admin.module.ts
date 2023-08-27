

import { AddPrefaceComponent } from './admin-home/add-preface/add-preface.component';
import { AdminComponent } from './admin.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { AdminMaterialModule } from './admin-material.module';
import { adminReducer } from './store/admin.reducer';
import { AdminRoutingModule } from './admin-routing.module';
import { CommonModule } from '@angular/common';
import { ConfirmComponent } from './shared/confirm/confirm.component';
import { CoordinatesComponent } from './venues/venues-table/venue-details/items-table/item-details/coordinates/coordinates.component';
import { ErrPageComponent } from './shared/err-page/err-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// import { ItemLscAudioComponent } from './venues/venues-table/venue-details/items-table/item-details/item-lsc/lsc-details/item-lsc-audio/item-lsc-audio.component';
// import { ItemLscComponent } from './venues/venues-table/venue-details/items-table/item-details/item-lsc/item-lsc.component.tsxxx';
// import { LscDescriptionComponent } from './venues/venues-table/venue-details/items-table/item-details/item-lsc/lsc-details/item-lsc-description/item-lsc-description.component';
// import { ItemLscDetailsComponent } from './venues/venues-table/venue-details/items-table/item-details/item-lsc/lsc-details/lsc-details.component';
// import { LscNameComponent } from './venues/venues-table/venue-details/items-table/item-details/item-lsc/lsc-details/item-lsc-name/item-lsc-name.component';
import { ItemStatsComponent } from './venues/venues-table/venue-details/items-table/item-details/item-stats/item-stats.component';
import { ItemsTableComponent } from './venues/venues-table/venue-details/items-table/items-table.component';
import { LanguageOptionsDialogComponent } from './venues/venues-table/venue-details/items-table/item-details/language-options-dialog/language-options-dialog.component'
import { LscTableComponent } from './venues/venues-table/venue-details/items-table/item-details/lsc-table/lsc-table.component';
import { MainItemComponent } from './venues/venues-table/venue-details/items-table/item-details/main-item/main-item.component';
import { NewItemComponent } from './venues/venues-table/venue-details/new-item/new-item.component';
import { NgModule } from '@angular/core';
// import { PreviewComponent } from './venues/venues-table/venue-details/items-table/item-details/item-lsc/lsc-details/preview/preview.component';
import { QrCodeComponent } from './qr-code/qr-code.component';
import { QRCodeModule } from 'angularx-qrcode';
import { RouterModule } from '@angular/router';
import { StatsComponent } from './venues/stats/stats.component';
import { StoreModule } from '@ngrx/store';
import { TopComponent } from './navigation/top/top.component';
import { VenueDetailsComponent } from './venues/venues-table/venue-details/venue-details.component';
import { VenueNameComponent } from './venues/venues-table/venue-details/venue-name/venue-name.component';
import { VenuesComponent } from './venues/venues.component';
import { VenuesTableComponent } from './venues/venues-table/venues-table.component';
import { WarningComponent } from './shared/warning/warning.component';
import { ItemDetailsComponent } from './venues/venues-table/venue-details/items-table/item-details/item-details.component';
import { ItemLscAudioComponent } from './venues/venues-table/venue-details/items-table/item-details/lsc-table/lsc-details/lsc-audio/lsc-audio.component';
import { LscDescriptionComponent } from './venues/venues-table/venue-details/items-table/item-details/lsc-table/lsc-details/lsc-description/lsc-description.component';
import { LscNameComponent } from './venues/venues-table/venue-details/items-table/item-details/lsc-table/lsc-details/lsc-name/lsc-name.component';
import { LscDetailsComponent } from './venues/venues-table/venue-details/items-table/item-details/lsc-table/lsc-details/lsc-details.component';
import { PreviewComponent } from './venues/venues-table/venue-details/items-table/item-details/lsc-table/lsc-details/preview/preview.component';
import { WindowStoreComponent } from './store/window-store/window-store.component';
// import { ItemLscAudioComponent } from './venues/venues-table/venue-details/items-table/item-details/lsc-table/item-lsc-details/item-lsc-audio/item-lsc-audio.component';
// import { LscDescriptionComponent } from './venues/venues-table/venue-details/items-table/item-details/lsc-table/item-lsc-details/item-lsc-description/item-lsc-description.component';
// import { LscNameComponent } from './venues/venues-table/venue-details/items-table/item-details/lsc-table/item-lsc-details/item-lsc-name/item-lsc-name.component';
// import { LscDetailsComponent } from './venues/venues-table/venue-details/items-table/item-details/lsc-table/item-lsc-details/lsc-details.component';
// import { PreviewComponent } from './venues/venues-table/venue-details/items-table/item-details/lsc-table/item-lsc-details/preview/preview.component';
// import { ItemLscAudioComponent } from './venues/venues-table/venue-details/items-table/item-details/lsc-table/lsc-details/item-lsc-audio/item-lsc-audio.component';
// import { LscDescriptionComponent } from './venues/venues-table/venue-details/items-table/item-details/lsc-table/lsc-details/item-lsc-description/item-lsc-description.component';
// import { LscNameComponent } from './venues/venues-table/venue-details/items-table/item-details/lsc-table/lsc-details/item-lsc-name/item-lsc-name.component';
// import { ItemLscDetailsComponent } from './venues/venues-table/venue-details/items-table/item-details/lsc-table/lsc-details/lsc-details.component';
// import { PreviewComponent } from './venues/venues-table/venue-details/items-table/item-details/lsc-table/lsc-details/preview/preview.component';



@NgModule({
    declarations: [
        AdminHomeComponent,
        WarningComponent,
        AdminComponent,
        ConfirmComponent,
        ItemDetailsComponent,

        QrCodeComponent,
        TopComponent,
        VenueDetailsComponent,
        VenuesComponent,
        ItemLscAudioComponent,
        LscDescriptionComponent,
        LscNameComponent,
        NewItemComponent,
        ErrPageComponent,
        // ItemLscComponent,
        LscDetailsComponent,
        LscTableComponent,
        ItemsTableComponent,
        VenuesTableComponent,
        VenueNameComponent,
        PreviewComponent,
        CoordinatesComponent,
        MainItemComponent,
        StatsComponent,
        ItemStatsComponent,
        AddPrefaceComponent,
        LanguageOptionsDialogComponent,
        WindowStoreComponent

    ],
    imports: [
        // SharedModule,
        AdminMaterialModule,
        AdminRoutingModule,
        CommonModule,
        FormsModule,
        FormsModule,
        QRCodeModule,
        ReactiveFormsModule,
        RouterModule,
        StoreModule.forFeature('admin', adminReducer)
    ],

})
export class AdminModule { }
