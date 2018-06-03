import HomeView from './home/containers/HomeView';
import LoginView from './auth/containers/LoginView';
import RewardView from './reward/containers/RewardView';
import { createStackNavigator, createDrawerNavigator, DrawerActions, HeaderBackButton } from 'react-navigation';
import styles from './config/styles';
import { View, Image, TouchableOpacity, Keyboard } from 'react-native';
import React from 'react';

const headerStyle = {
  backgroundColor: '#99C33A',
};

const DrawerButton = (props) => {
  return (
    <View>
      <TouchableOpacity
        name="menu"
        color="#fff"
        style={styles.drawerIcon}
        onPress={() => {
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

// <Icon name="bars" size={30} color="#ffffff" />

const DrawerNav = createDrawerNavigator({
  Home: {
    screen: createStackNavigator({
      Home: {
        screen: HomeView,
      },
    }, {
      initialRouteName: 'Home',
      navigationOptions: ({ navigation }) => ({
        headerStyle,
        headerLeft: <DrawerButton navigation={navigation} />,
      }),
    }),
  },
  Reward: {
    screen: createStackNavigator({
      Reward: {
        screen: RewardView,
      },
    }, {
      initialRouteName: 'Reward',
      navigationOptions: ({ navigation }) => ({
        headerStyle,
        headerLeft: <HeaderBackButton tintColor="white" onPress={() => navigation.navigate('Home')} />,
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
  initialRouteName: 'Home',
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
