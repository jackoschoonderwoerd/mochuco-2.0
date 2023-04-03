
export interface LSContent {
    language: string;
    name?: string,
    description?: string,
    audioUrl?: string
}

export interface ItemByLanguage {

    language: string;
    name: string;
    description: string
}



export interface Item {
    latitude?: string;
    longitude?: string;
    name: string;
    isMainItem?: boolean;
    id?: string;
    imageUrl?: string;
    itemByLanguages?: ItemByLanguage[]
}

export interface Visit {
    timestamp: number;
    liked: boolean
}
