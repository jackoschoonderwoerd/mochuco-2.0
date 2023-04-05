import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class FlagService {

    constructor() { }

    convertLanguageToCountryCode(language: string): string {
        const baseString: string = 'fi fi-'
        switch (language) {
            case 'dutch':
                return `${baseString}nl`;
            case 'german':
                return `${baseString}de`;
            case 'english':
                return `${baseString}gb`;
        }
    }
}
