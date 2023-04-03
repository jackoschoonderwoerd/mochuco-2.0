import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { ScannerComponent } from './item/scanner/scanner.component';
import { ItemComponent } from './item/item.component';
import { ItemFooterComponent } from './item/item-footer/item-footer.component';
import { ItemHeaderComponent } from './item/item-header/item-header.component';
import { MatIconModule } from '@angular/material/icon';



@NgModule({

    imports: [
        MatIconModule
    ],
    exports: [
        MatIconModule
    ]
})
export class UserMaterialModule { }
