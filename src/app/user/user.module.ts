import { NgModule } from '@angular/core';


import { UserRoutingModule } from './user-routing.module';
import { ScannerComponent } from './item/scanner/scanner.component';
import { ItemComponent } from './item/item.component';
import { ItemFooterComponent } from './item/item-footer/item-footer.component';
import { ItemHeaderComponent } from './item/item-header/item-header.component';
import { SharedMaterialModule } from '../shared/shared-material.module';

// import { SharedModule } from '../shared/shared.module.tsXXX';
// import { CommonModule } from '@angular/common';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './item/sidebar/sidebar.component';
import { UserMaterialModule } from './user-material.module';





@NgModule({
    declarations: [
        ScannerComponent,
        ItemComponent,
        ItemFooterComponent,
        ItemHeaderComponent,
        SidebarComponent,

    ],
    imports: [
        CommonModule,
        UserRoutingModule,
        SharedMaterialModule,
        ZXingScannerModule,
        UserMaterialModule
        // SharedModule
    ],

})
export class UserModule { }
