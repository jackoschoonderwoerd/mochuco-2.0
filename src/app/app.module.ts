import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideFunctions, getFunctions } from '@angular/fire/functions';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { environment } from '../environments/environment';
// import { SharedModule } from './shared/shared.module.tsXXX';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from './app-material.module';
import { ItemDetailsDbService } from './admin/venues/venue-details/item-details/item-details-db.service';
import { VenuesService } from './admin/venues/venues.service';





@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [

        AppRoutingModule,
        BrowserModule,
        // SharedModule,
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideAuth(() => getAuth()),
        provideFirestore(() => getFirestore()),
        provideFunctions(() => getFunctions()),
        provideStorage(() => getStorage()),
        BrowserAnimationsModule,
        AppMaterialModule


    ],


    // providers: [ItemDetailsDbService, VenuesService],
    bootstrap: [AppComponent]
})
export class AppModule { }
