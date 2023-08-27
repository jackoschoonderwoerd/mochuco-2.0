


export interface Venue {
    ownerId: string;
    venueName: string;
    logoUrl?: string;
    id?: string;
    items?: Item[];
}


export interface Item {
    latitude?: number;
    longitude?: number;
    name: string;
    isMainItem?: boolean;
    id?: string;
    imageUrl?: string;
    languages?: LSContent[]
}

export interface LSContent {
    language: string,
    name?: string;
    description?: string,
    audioUrl?: string
}

export interface Visit {
    timestamp: number;
    liked: boolean
}

export interface IdParams {
    venueId: string;
    itemId: string;
}
