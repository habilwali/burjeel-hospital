/**
 * Video item from get_background_videos API
 * @see https://cmt-technologies.net/iptv-cms/api/get_background_videos.php
 */
export interface BackgroundVideo {
  title: string;
  description: string;
  file_url: string;
  department: string;
}

/**
 * Response from get_background_videos.php
 */
export interface GetBackgroundVideosResponse {
  status: 'success' | string;
  mac: string;
  videos: BackgroundVideo[];
}

