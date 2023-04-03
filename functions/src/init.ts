// import { initializeApp } from '@angular/fire/app';
// import { getFirestore } from '@angular/fire/firestore';
// import { getAuth } from '@angular/fire/auth';
// import { getStorage } from '@angular/fire/storage';

const admin = require('firebase-admin');

admin.initializeApp();

export const db = admin.getFirestore();

export const auth = admin.getAuth();

export const storage = admin.getStorage();
