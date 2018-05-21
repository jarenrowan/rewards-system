import HomeView from './home/containers/Home';
import { createStackNavigator } from 'react-navigation';

const StackNav = createStackNavigator(
  {
    Home: {
      screen: HomeView,
    },
  }, { initialRouteName: 'Home' }
);

const AppNavigator = StackNav;
export default AppNavigator;
