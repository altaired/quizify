declare namespace SAPI {

  interface PagingObject<T> {
    href: string;
    items: T[];
    limit: number;
    next: string;
    offset: number;
    previous: string;
    total: number;
  }

  interface PlaylistObject {
    collaborative: boolean;
    external_urls: ExternalURLObject[];
    href: string;
    id: string;
    images: ImageObject[];
    name: string;
    owner: UserObject;
    public: boolean;
    snapshot_id: string;
    tracks: TrackObject;
    type: string;
    uri: string;
  }

  interface UserObject {
    display_name: string;
    external_urls: ExternalURLObject[];
    followers: FollowerObject[];
    href: string;
    id: string;
    images: ImageObject[];
    type: string;
    uri: string;
  }

  interface PlaylistTrackObject {
    added_at: string;
    added_by: UserObject;
    is_local: boolean;
    track: TrackObject;
  }

  interface ArtistObject {
    external_urls: ExternalURLObject[];
    followers: FollowerObject[];
    genres: string[];
    href: string;
    id: string;
    images: ImageObject[];
    name: string;
    popularity: number;
    type: string;
    uri: string;
  }

  interface FollowerObject {
    href: string;
    total: number;
  }

  interface TrackObject {
    album: AlbumObject;
    artists: ArtistObject[];
    available_markets: string[];
    disc_number: number;
    duration_ms: number;
    explicit: boolean;
    external_ids: ExternalIDObject[];
    external_urls: ExternalURLObject[];
    href: string;
    id: string;
    is_playable: true;
    linked_from: LinkedTrackObject;
    restrictions: any;
    name: string;
    popularity: number;
    preview_url: string;
    track_number: number;
    type: string;
    uri: string;
  }

  interface AlbumObject {
    album_group?: string;
    album_type: string;
    artists: ArtistObject[];
    available_markets: string[];
    external_urls: ExternalURLObject[];
    href: string;
    id: string;
    images: ImageObject[];
    name: string;
    release_date: string;
    release_date_precision: string;
    restrictions: any;
    type: string;
    uri: string;
  }

  interface ImageObject {
    height: number;
    url: string;
    width: number;
  }

  interface ArtistObject {
    external_urls: ExternalURLObject[];
    href: string;
    id: string;
    name: string;
    type: string;
    uri: string;
  }

  interface ExternalIDObject {
    key: string;
    value: string;
  }

  interface ExternalURLObject {
    key: string;
    value: string;
  }

  interface LinkedTrackObject {
    external_urls: ExternalURLObject[];
    href: string;
    id: string;
    type: string;
    uri: string;
  }

  interface CategoryObject {
    href: string;
    icons: ImageObject[];
    id: string;
    name: string;
  }

}
