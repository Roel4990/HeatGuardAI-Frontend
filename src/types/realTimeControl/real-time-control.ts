export interface CoolingFogListItem {
  cf_cd: string;
  lat: number;
  lng: number;
}

export interface CoolingFogListData {
  total_count: number;
  cf_list: CoolingFogListItem[];
}

export interface CoolingFogTimeSlot {
  cf_selected_temp: number;
  cf_nearby_temp: number;
  cf_hum_per: number;
}

export interface CoolingFogDetailData {
  cf_city_gu: string;
  cf_city_dong: string;
  cf_location: string;
  cf_address: string;
  lat: number;
  lng: number;
  cf_state: boolean;
  cf_selected_temp: number;
  cf_nearby_temp: number;
  cf_hum_per: number;
  cf_inst_date: string;
  cf_manage_dept: string;
  cf_manager_nm: string;
  cf_manager_contact: string;
  time: Record<string, CoolingFogTimeSlot>;
}
