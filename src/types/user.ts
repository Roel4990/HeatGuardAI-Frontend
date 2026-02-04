export interface User {
  id: string;
  name?: string;
  avatar?: string;
  email?: string;
	user_cd?: string;

  [key: string]: unknown;
}
