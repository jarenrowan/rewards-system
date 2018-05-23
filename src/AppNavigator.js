import HomeView from './home/containers/Home';
import LoginView from './auth/containers/LoginView';
import { createStackNavigator } from 'react-navigation';

const StackNav = createStackNavigator(
  {
    Home: {
      screen: HomeView,
    },
    Login: {
      screen: LoginView,
    },
  }, { initialRouteName: 'Login' }
);

const AppNavigator = StackNav;
export default AppNavigator;
