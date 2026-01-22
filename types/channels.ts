/**
 * Channel item from getChannels API.
 * Response shape: { "id": 119, "name": "Joy Forum", "stream_url": "udp://...", "logo": "...", "status": "Online" }
 * @see https://cmt-technologies.net/iptv-cms/api/getChannels.php
 */
export interface ChannelItemApi {
  id: number;
  name: string;
  stream_url: string;
  logo: string;
  status: string;
}

/**
 * Response from getChannels.php?category_id=
 * { "success": true, "category_id": 37, "channels": ChannelItemApi[] }
 */
export interface GetChannelsResponse {
  success: boolean;
  category_id: number;
  channels: ChannelItemApi[];
}

