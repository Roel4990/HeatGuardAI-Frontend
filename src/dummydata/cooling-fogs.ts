import { cfmarkers } from './cfmarkers';

export type CoolingFogTimeSlot = {
  cf_selected_temp: number;
  cf_nearby_temp: number;
};

export type CoolingFogData = {
  cf_cd: string;
  cf_cty: string;
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
  cf_manager_dept: string;
  cf_manager_nm: string;
  cf_manager_contact: string;
  time: Record<string, CoolingFogTimeSlot>;
};

export type CoolingFogRecord = {
  data: CoolingFogData;
};

const defaultTime: Record<string, CoolingFogTimeSlot> = {
  '00:00': { cf_selected_temp: 25.8, cf_nearby_temp: 23.8 },
  '06:00': { cf_selected_temp: 27.8, cf_nearby_temp: 29.8 },
  '12:00': { cf_selected_temp: 30.8, cf_nearby_temp: 32.8 },
  '18:00': { cf_selected_temp: 28.8, cf_nearby_temp: 30.8 },
};

export const coolingFogsById: Record<string, CoolingFogRecord> = cfmarkers.reduce<Record<string, CoolingFogRecord>>(
  (acc, marker, index) => {
    const cf_cd = marker.cf_cd;
    acc[cf_cd] = {
      data: {
        cf_cd,
        cf_cty: '서울특별시',
        cf_city_gu: '중구',
        cf_city_dong: '중림동',
        cf_location: `손기정체육공원 ${index + 1}`,
        cf_address: '서울특별시 중구 만리동2가 6-1',
        lat: marker.lat,
        lng: marker.lng,
        cf_state: index % 2 === 0,
        cf_selected_temp: 33.3,
        cf_nearby_temp: 35.8,
        cf_hum_per: 48.5,
        cf_inst_date: '2024-06-20',
        cf_manager_dept: '공원 녹지과',
        cf_manager_nm: `김영지 ${index + 1}`,
        cf_manager_contact: '02-3396-5854',
        time: defaultTime,
      },
    };
    return acc;
  },
  {}
);

export const coolingFogs: CoolingFogData[] = Object.values(coolingFogsById).map((item) => item.data);
