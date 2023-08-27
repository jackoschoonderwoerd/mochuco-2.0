import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItemComponent } from './item/item.component';
import { ScannerComponent } from './item/scanner/scanner.component';
import { AdminComponent } from '../admin/admin.component';
import { AboutComponent } from './about/about.component';
import { LogInComponent } from '../admin/auth/log-in/log-in.component';
import { UserErrorPageComponent } from './user-error-page/user-error-page.component';

const routes: Routes = [
    {
        path: '', component: ItemComponent
    },
    {
        path: 'scanner', component: ScannerComponent
    },
    {
        path: 'admin', component: AdminComponent
    },
    {
        path: 'about', component: AboutComponent
    },
    {
        path: 'user-error-page', component: UserErrorPageComponent
    },
    {
        path: 'log-in',
        component: LogInComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserRoutingModule { }
