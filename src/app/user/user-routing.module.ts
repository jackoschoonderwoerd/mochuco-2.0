import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItemComponent } from './item/item.component';
import { ScannerComponent } from './item/scanner/scanner.component';
import { AdminComponent } from '../admin/admin.component';

const routes: Routes = [
    {
        path: '', component: ItemComponent
    },
    {
        path: 'scanner', component: ScannerComponent
    },
    {
        path: 'admin', component: AdminComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserRoutingModule { }