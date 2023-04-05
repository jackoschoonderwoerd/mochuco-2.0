// import { MatIconModule } from '@angular/material/icon';
// import { MatListModule } from '@angular/material/list';
// import { MatMenuModule } from '@angular/material/menu';
// import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgModule } from "@angular/core";
import { MatSortModule } from '@angular/material/sort';

@NgModule({
    imports: [
        // MatIconModule,
        // MatListModule,
        // MatMenuModule
        // MatSidenavModule,
        MatButtonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatSelectModule,
        MatSnackBarModule,
        MatTableModule,
        MatToolbarModule,
        MatSortModule,

    ],
    exports: [
        // MatIconModule,
        // MatListModule,
        // MatMenuModule
        // MatSidenavModule,
        // MatSnackBarModule,
        MatButtonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatSelectModule,
        MatTableModule,
        MatToolbarModule,
        MatSortModule
    ]
})

export class AdminMaterialModule { }
