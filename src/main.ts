import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';


platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.error(err));


// import { NgModule } from '@angular/core';
// import {
//     getAllDataFromLocalForage,
//     default as localForage,
// } from 'ngrx-store-persist';

// getAllDataFromLocalForage({
//     driver: localForage.INDEXEDDB,
//     keys: [
//         'user',
//         'posts'
//     ],
// }).then(() => {
//     console.log('getAllDataFromLocalForage from main.ts')
//     platformBrowserDynamic()
//         .bootstrapModule(AppModule)
//         .catch(err => console.log(err));
// });
