/**
 * Facility group types
 */
export interface FacilityGroup {
  id: string;
  name: string;
}

export interface FacilityGroupsApiResponse {
  status: string;
  data: FacilityGroup[];
}

/**
 * Facility types
 */
export interface Facility {
  id?: string;
  name?: string;
  description?: string;
  image?: string;
  video?: string;
  content?: string;
  [key: string]: any; // Allow additional properties from API
}

export interface FacilitiesApiResponse {
  status: string;
  data: Facility[];
}
