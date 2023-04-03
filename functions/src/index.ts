import * as functions from "firebase-functions";
// import { db } from './init';

import * as admin from 'firebase-admin';




admin.initializeApp();

// export const db = admin.firestore();

// export const auth = admin.auth();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript

// export const helloWorld = functions.https.onRequest((request, response) => {
//     functions.logger.info("Hello blogs!", { structuredData: true });
//     response.send("Hello from Jacko!");
// });

// https://github.com/angular-university/firebase-course/blob/master/functions/src/create-user.ts
// auth.setCustomUserClaims(user.uid, {admin})

export const onDeleteVenueStorage =
    functions
        .firestore.document('venues/{venueId}')

        .onDelete(async (snap: any, context: any) => {
            functions.logger.debug(
                `Deleting venue storage: ${context.params.venueId}`
            )
            const bucket = admin.storage().bucket()
            bucket.deleteFiles({
                prefix: `venues/${context.params.venueId}/`
            }, function (err: any) {
                if (err) {
                    console.log(err)
                } else {
                    console.log(`All the Firebase Storage files in venues/${context.params.venueId} have been deleted`)
                };
            })
        })
export const onDeleteItemStorage =
    functions
        .firestore.document('venues/{venueId}/items/{itemId}')
        .onDelete(async (snap: any, context: any) => {
            functions.logger.debug(
                'Deleting item storage'
            )
            const bucket = admin.storage().bucket()
            bucket.deleteFiles({
                prefix: `venues/${context.params.venueId}/items/${context.params.itemId}/`
            }, function (err: any) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(`All the Firebase Storage files in venues/${context.params.venueId} - ${context.params.itemId} have been deleted`)
                }
            })
        })


// export const addUserToDb =
//     functions.auth.user().onCreate((user) => {
//         admin.firestore().collection('users').doc(`${user.uid}`).set({ venuesOwned: [] })

//             .then(res => console.log('user added to db', res))
//             .catch(err => console.log(err));
//     })

