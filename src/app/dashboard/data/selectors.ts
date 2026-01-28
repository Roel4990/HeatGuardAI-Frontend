import { HOTLINE_CONTACTS } from "@/app/dashboard/data/hotlineData";

export const DISTRICTS = Array.from(
	new Set(HOTLINE_CONTACTS.map((c) => c.district))
);

export function getDongsByDistrict(district: string) {
	return Array.from(
		new Set(
			HOTLINE_CONTACTS
				.filter((c) => c.district === district && c.dong)
				.map((c) => c.dong!)
		)
	);
}
