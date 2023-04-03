import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { SharedModule } from '../shared/shared.module.tsXXX';


import { AdminComponent } from './admin.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { AdminMaterialModule } from './admin-material.module';
import { AdminRoutingModule } from './admin-routing.module';
import { CommonModule } from '@angular/common';
import { ConfirmComponent } from './shared/confirm/confirm.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ItemDetailsComponent } from './venues/venue-details/item-details/item-details.component';
import { LogInComponent } from './auth/log-in.component';
import { QrCodeComponent } from './qr-code/qr-code.component';
import { QRCodeModule } from 'angularx-qrcode';
import { RouterModule } from '@angular/router';
import { TopComponent } from './navigation/top/top.component';
import { VenueDetailsComponent } from './venues/venue-details/venue-details.component';
import { VenuesComponent } from './venues/venues.component';
import { WarningComponent } from './shared/warning/warning.component';
import { ItemLscAudioComponent } from './venues/venue-details/item-details/item-lsc/item-lsc-details/item-lsc-audio/item-lsc-audio.component';
import { ItemLscDescriptionComponent } from './venues/venue-details/item-details/item-lsc/item-lsc-details/item-lsc-description/item-lsc-description.component';
import { ItemLscNameComponent } from './venues/venue-details/item-details/item-lsc/item-lsc-details/item-lsc-name/item-lsc-name.component';
import { NewItemComponent } from './venues/venue-details/new-item/new-item.component';
import { ErrPageComponent } from './shared/err-page/err-page.component';
import { ItemLscComponent } from './venues/venue-details/item-details/item-lsc/item-lsc.component';
import { ItemLscDetailsComponent } from './venues/venue-details/item-details/item-lsc/item-lsc-details/item-lsc-details.component';
import { LscTableComponent } from './venues/venue-details/item-details/lsc-table/lsc-table.component';
import { ItemTableComponent } from './venues/venue-details/item-table/item-table.component';
import { VenuesTableComponent } from './venues/venues-table/venues-table.component';
import { VenueNameComponent } from './venues/venue-details/venue-name/venue-name.component';
import { SnackbarService } from './shared/snackbar.service';
import { ItemDetailsDbService } from './venues/venue-details/item-details/item-details-db.service';
import { PreviewComponent } from './venues/venue-details/item-details/item-lsc/item-lsc-details/preview/preview.component';
import { CoordinatesComponent } from './venues/venue-details/item-details/coordinates/coordinates.component';
import { MainItemComponent } from './venues/venue-details/item-details/main-item/main-item.component';
import { StatsComponent } from './venues/stats/stats.component';
import { ItemStatsComponent } from './venues/venue-details/item-details/item-stats/item-stats.component';
import { AddPrefaceComponent } from './admin-home/add-preface/add-preface.component';


@NgModule({
    declarations: [
        AdminHomeComponent,
        WarningComponent,
        AdminComponent,
        ConfirmComponent,
        ItemDetailsComponent,
        LogInComponent,
        QrCodeComponent,
        TopComponent,
        VenueDetailsComponent,
        VenuesComponent,
        ItemLscAudioComponent,
        ItemLscDescriptionComponent,
        ItemLscNameComponent,
        NewItemComponent,
        ErrPageComponent,
        ItemLscComponent,
        ItemLscDetailsComponent,
        LscTableComponent,
        ItemTableComponent,
        VenuesTableComponent,
        VenueNameComponent,
        PreviewComponent,
        CoordinatesComponent,
        MainItemComponent,
        StatsComponent,
        ItemStatsComponent,
        AddPrefaceComponent

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
        RouterModule
    ],

})
export class AdminModule { }
