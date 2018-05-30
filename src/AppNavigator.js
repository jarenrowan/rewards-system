import HomeView from './home/containers/HomeView';
import LoginView from './auth/containers/LoginView';
import { createStackNavigator, createDrawerNavigator, DrawerActions } from 'react-navigation';
import styles from './config/styles';
import { View, Image, TouchableOpacity, Keyboard } from 'react-native';
import React from 'react';

const DrawerButton = (props) => {
  return (
    <View>
      <TouchableOpacity
        name="menu"
        color="#fff"
        style={styles.drawerIcon}
        onPress={() => {
          console.log(props.navigation);
          props.navigation.dispatch(DrawerActions.openDrawer());
          Keyboard.dismiss();
        }}>
        <Image
            style={{ width: 30, height: 30 }}
            source={require('../resources/images/icons8-menu-filled-50.png')}
          />
        </TouchableOpacity>
    </View>
  );
};

const DrawerNav = createDrawerNavigator({
  Rewards: {
    screen: createStackNavigator({
      Home: {
        screen: HomeView,
      },
    }, {
      initialRouteName: 'Home',
      navigationOptions: ({ navigation }) => ({
        headerLeft: <DrawerButton navigation={navigation} />,
      }),
    }),
  },
  Logout: {
    screen: createStackNavigator({
      Login: {
        screen: LoginView,
      },
    }, {
      initialRouteName: 'Login',
      navigationOptions: {
        header: null,
        headerMode: 'none',
      },
    }),
  },
}, {
  initialRouteName: 'Rewards',
});

const StackNav = createStackNavigator({
  Drawer: {
    screen: DrawerNav,
    navigationOptions: {
      header: null,
      headerMode: 'none',
    },
  },
  Login: {
    screen: LoginView,
    navigationOptions: {
      header: null,
      headerMode: 'none',
    },
  },
}, {
  initialRouteName: 'Login',
});

const AppNavigator = StackNav;
export default AppNavigator;
