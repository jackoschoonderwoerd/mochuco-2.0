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
import { AboutComponent } from './about/about.component';
import { LogInComponent } from '../admin/auth/log-in/log-in.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserErrorPageComponent } from './user-error-page/user-error-page.component';






@NgModule({
    declarations: [
        ScannerComponent,
        ItemComponent,
        ItemFooterComponent,
        ItemHeaderComponent,
        SidebarComponent,
        AboutComponent,
        LogInComponent,
        UserErrorPageComponent

    ],
    imports: [
        CommonModule,
        UserRoutingModule,
        SharedMaterialModule,
        ZXingScannerModule,
        UserMaterialModule,
        FormsModule,
        ReactiveFormsModule
        // SharedModule
    ],

})
export class UserModule { }
