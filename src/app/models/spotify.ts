export interface AlbumObj {
  album_type: string;
  artists: ArtistObj[];
  available_markets: string[];
  copyrights: CopyrightObj[];
  external_ids: ExternalIDObj[];
  external_urls: ExternalURLObj[];
  genres: string[];
  href: string;
  id: string;
  images: ImageObj[];
  label: string;
  name: string;
  popularity: number;
  release_date: string;
  release_date_precision: string;
  restrictions: any;
  tracks: PagingObj<TrackObj>;
  type: string;
  uri: string;
}

export interface ArtistObj {
  external_urls: ExternalURLObj[];
  followers: FollowerObj[];
  genres: string[];
  href: string;
  id: string;
  images: ImageObj[];
  name: string;
  popularity: number;
  type: string;
  uri: string;
}

export interface CopyrightObj {
  text: string;
  type: string;
}

export interface ExternalIDObj {
  key: string;
  value: string;
}

export interface ExternalURLObj {
  key: string;
  value: string;
}

export interface ImageObj {
  height: number;
  width: number;
  url: string;
}

export interface TrackObj {
  album: AlbumObj;
  artist: ArtistObj[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: ExternalIDObj[];
  external_urls: ExternalURLObj[];
  href: string;
  id: string;
  is_playable: boolean;
  name: string;
  popularity: number;
  preview_url: string;
  track_number: number;
  type: string;
  uri: string;
  is_local: boolean;
}

export interface FollowerObj {
  href: string;
  total: number;
}

export interface PagingObj<T> {
  href: string;
  items: T[];
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
}

export interface ErrorObj {
  status: number;
  message: string;
}

export interface PlayerErrorObj extends ErrorObj {
  reason: string;
}

export interface AudioFeaturesObj {
  acousticness: number;
  analysis_url: string;
  danceability: number;
  duration_ms: number;
  energy: number;
  id: string;
  instrumentalness: number;
  key: number;
  liveness: number;
  loudness: number;
  mode: number;
  speechiness: number;
  tempo: number;
  time_signature: number;
  track_href: string;
  type: string;
  uri: string;
  valence: number;
}

export interface CategoryObj {
  href: string;
  icons: ImageObj[];
  id: string;
  name: string;
}

export interface ContextObj {
  type: string;
  href: string;
  external_urls: ExternalURLObj[];
  uri: string;
}

export interface CursorObj {
  after: string;
}

export interface PlayHistoryObj {
  track: TrackObj[];
  played_at: string;
  context: ContextObj;
}

export interface PlaylistObj {
  collaborative: boolean;
  description: string;
  external_urls: ExternalURLObj[];
  followers: FollowerObj[];
  href: string;
  id: string;
  images: ImageObj[];
  name: string;
  owner: UserObj;
  public: boolean;
  snapshot_id: string;
  tracks: PagingObj<PlaylistTrackObj>;
  type: string;
  uri: string;
}

export interface PlaylistTrackObj {
  added_at: string;
  added_by: UserObj;
  is_local: boolean;
  track: TrackObj;
}

export interface UserObj {
  birthdate?: string;
  country?: string;
  display_name: string;
  email?: string;
  external_urls: ExternalURLObj[];
  followers: FollowerObj[];
  href: string;
  id: string;
  images: ImageObj[];
  product?: string;
  type: string;
  uri: string;
}

export interface TrackLinkObj {
  external_urls: ExternalURLObj[];
  href: string;
  id: string;
  type: string;
  uri: string;
}

export interface RelatedArtists{
  artists: ArtistObj[];
}

export interface DeviceObj{
  id: string,
  is_active: boolean,
  is_private_session: boolean,
  is_restricted: false,
  name: string,
  type: string,
  volume_percent: number
}
export interface Devices{
  devices: DeviceObj[];
}