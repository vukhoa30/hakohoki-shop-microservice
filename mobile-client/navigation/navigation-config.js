import { TabNavigator, TabBarBottom, StackNavigator, SwitchNavigator } from "react-navigation";
import Ionicons from 'react-native-vector-icons/Ionicons';
import React from 'react';
import Home from "../components/home";
import User from "../containers/user";
import { StyleSheet } from 'react-native'
import SignIn from "../components/sign-in";
import SignUp from "../components/sign-up";

const accountNavigator = SwitchNavigator({

    SignIn: {
        screen: SignIn
    },
    SignUp: {
        screen: SignUp
    }

})

const mainNavigator = TabNavigator(
    {
        Home: {
            screen: Home
        },
        User: {
            screen: User
        }
    },
    {
        /* The header config from HomeScreen is now here */
        navigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ focused, tintColor }) => {
                const { routeName } = navigation.state;
                switch (routeName) {

                    case 'Home':
                        return <Ionicons name={focused ? 'ios-home' : 'ios-home-outline'} style={styles.icon} />
                    case 'User':
                        return <Ionicons name={focused ? 'ios-person' : 'ios-person-outline'} style={styles.icon} />
                    default:
                        return <Ionicons name='ios-information-circle-outline' style={styles.icon} />

                }
            },
        }),
        tabBarComponent: TabBarBottom,
        tabBarPosition: 'bottom',
        tabBarOptions: {
            activeTintColor: 'tomato',
            inactiveTintColor: 'gray',
        },
        animationEnabled: true,
        swipeEnabled: true,
    }
);

const styles = StyleSheet.create({

    icon: {
        fontSize: 20,
        color: 'red'
    }

})


const navigator = StackNavigator(
    {
        Main: {
            screen: mainNavigator
        },
        Account: {
            screen: accountNavigator
        }
    },
    {
        initialRouteName: 'Main',
        headerMode: 'none'
    }
)

export default navigator;