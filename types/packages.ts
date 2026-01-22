/**
 * Package item from getPackages API.
 * Response shape: { "id": 37, "name": "News", "price": 0, "image": null }
 * @see https://cmt-technologies.net/iptv-cms/api/getPackages.php
 */
export interface PackageItem {
  id: number;
  name: string;
  price: number;
  image: string | null;
}

/**
 * Response from getPackages.php.
 * { "success": true, "mac": "A4:34:D9:E6:F7:30", "packages": PackageItem[] }
 */
export interface GetPackagesResponse {
  success: boolean;
  mac: string;
  packages: PackageItem[];
}

