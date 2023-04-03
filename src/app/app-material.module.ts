import { NgModule } from "@angular/core";

// import { MatToolbarModule } from '@angular/material/toolbar';

// import { MatSidenavModule } from '@angular/material/sidenav';
// import { MatIconModule } from '@angular/material/icon';

// import { MatListModule } from '@angular/material/list';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
// import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from "@angular/material/dialog";
// import { MatSelectModule } from "@angular/material/select";
// import { MatMenuModule } from '@angular/material/menu';

@NgModule({
    imports: [
        // MatToolbarModule,
        // MatListModule,
        // MatSidenavModule,
        // MatIconModule,
        // MatFormFieldModule,
        // MatInputModule,
        MatButtonModule,
        // MatProgressSpinnerModule,
        // MatSnackBarModule,
        MatDialogModule,
        // MatSelectModule,
        // MatMenuModule

    ],
    exports: [
        // MatToolbarModule,
        // MatListModule,
        // MatSidenavModule,
        // MatIconModule,
        // MatFormFieldModule,
        // MatInputModule,
        MatButtonModule,
        // MatProgressSpinnerModule,
        // MatSnackBarModule,
        MatDialogModule,
        // MatSelectModule,
        // MatMenuModule
    ]
})

export class AppMaterialModule { }
