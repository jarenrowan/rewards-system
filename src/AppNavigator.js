import HomeView from './home/containers/HomeView';
import LoginView from './auth/containers/LoginView';
import RewardView from './reward/containers/RewardView';
import { createStackNavigator, createDrawerNavigator, DrawerActions, HeaderBackButton } from 'react-navigation';
import styles from './config/styles';
import { View, Keyboard } from 'react-native';
import React from 'react';
import * as Icon from 'react-native-vector-icons/Ionicons';

const headerStyle = {
  backgroundColor: '#99C33A',
};

const DrawerButton = (props) => {
  return (
    <View style={styles.navigationHeader}>
      <Icon.Button name="ios-menu" size={45} backgroundColor="transparent" color="#ffffff" onPress={() => {
          props.navigation.dispatch(DrawerActions.openDrawer());
          Keyboard.dismiss();
        }}
      />
    </View>
  );
};

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
        headerLeft: <HeaderBackButton size={45} tintColor="white" onPress={() => navigation.navigate('Home')} />,
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
