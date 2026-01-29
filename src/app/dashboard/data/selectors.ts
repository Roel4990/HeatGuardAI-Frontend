import { HOTLINE_CONTACTS } from "@/app/dashboard/data/hotline-data";

export const DISTRICTS = [
	...new Set(HOTLINE_CONTACTS.map((c) => c.district)),
];

export function getDongsByDistrict(district: string) {
	return [
		...new Set(
			HOTLINE_CONTACTS
				.filter((c) => c.district === district && c.dong)
				.map((c) => c.dong!)
		),
	];
}