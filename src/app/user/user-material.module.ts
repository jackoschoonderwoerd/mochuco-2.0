import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { ScannerComponent } from './item/scanner/scanner.component';
import { ItemComponent } from './item/item.component';
import { ItemFooterComponent } from './item/item-footer/item-footer.component';
import { ItemHeaderComponent } from './item/item-header/item-header.component';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';



@NgModule({

    imports: [
        MatIconModule,
        MatProgressSpinnerModule,
        MatFormFieldModule,
        MatInputModule
    ],
    exports: [
        MatIconModule,
        MatProgressSpinnerModule,
        MatFormFieldModule,
        MatInputModule
    ]
})
export class UserMaterialModule { }
