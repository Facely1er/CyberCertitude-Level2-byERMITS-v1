import { 
  ProfileView,
  SettingsView,
  HelpView,
  LoginPage
} from '../components/LazyComponents';

export const accountRoutes = [
  {
    path: "/profile",
    element: ProfileView,
    title: "User Profile"
  },
  {
    path: "/settings",
    element: SettingsView,
    title: "Settings"
  },
  {
    path: "/help",
    element: HelpView,
    title: "Help"
  },
  {
    path: "/login",
    element: LoginPage,
    title: "Login"
  }
];
