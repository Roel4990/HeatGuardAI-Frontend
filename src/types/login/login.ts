export type UserType = "user" | "admin";

export interface LoginResult {
	access_token: string;
	expires_in: number;
	user_auth: UserType;
	user_nm: string;
	user_email: string;
	user_cd:string;
}
