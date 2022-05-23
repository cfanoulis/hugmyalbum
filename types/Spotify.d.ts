export interface Track {
	album: Album;
	artists: Artist[];
	external_urls: {
		spotify: string;
	};
	href: string;
	id: string;
	is_local: boolean;
	name: string;
	popularity: number;
	preview_url: string;
	track_number: number;
	type: string;
	uri: string;
}

export interface Album {
	album_type: string;
	artists: Artist[];
	external_urls: {
		spotify: string;
	};
	href: string;
	id: string;
	images: Image[];
	name: string;
	total_tracks: number;
	type: string;
	uri: string;
}

export interface Artist {
	external_urls: {
		spotify: string;
	};
	href: string;
	id: string;
	name: string;
	type: string;
	uri: string;
}

export interface Image {
	height: number;
	url: string;
	width: number;
}
