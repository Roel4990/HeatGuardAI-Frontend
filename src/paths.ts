export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  dashboard: {
    overview: '/dashboard',
    account: '/dashboard/account',
    customers: '/dashboard/customers',
    integrations: '/dashboard/integrations',
    settings: '/dashboard/settings',
		realTimeControl: '/dashboard/realTimeControl',
		AIBestLocation: '/dashboard/AIBestLocation',
		budgetSimulation: '/dashboard/budgetSimulation',
		notice: '/dashboard/notice',
  },
  errors: { notFound: '/errors/not-found' },
} as const;
