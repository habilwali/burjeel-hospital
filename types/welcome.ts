/**
 * Response from welcome_api.php
 * @see https://cmt-technologies.net/iptv-cms/api/welcome_api.php
 */
export interface WelcomeApiResponse {
  success: boolean;
  room_number: string;
  client_name: string;
  welcome_message: string;
  signature_title: string;
}

