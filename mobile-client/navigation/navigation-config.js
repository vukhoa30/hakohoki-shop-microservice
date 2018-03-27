import { TabNavigator, TabBarBottom, StackNavigator, SwitchNavigator } from "react-navigation";
import Ionicons from 'react-native-vector-icons/Ionicons';
import React from 'react';
import Home from "../screens/home";
import User from "../screens/user";
import { StyleSheet } from 'react-native'
import SignIn from "../screens/sign-in";
import SignUp from "../screens/sign-up";
import ActivationForm from "../screens/activation-form";
import { Icon } from 'native-base'

const accountNavigator = StackNavigator({

    AuthenticateAndEnroll: {

        screen: TabNavigator({

            SignIn: {
                screen: SignIn
            },
            SignUp: {
                screen: SignUp
            }

        }, {
                navigationOptions: {
                    headerStyle: {
                        backgroundColor: 'green',
                    },
                }
            })

    },

    ActivationForm: {
        screen: ActivationForm
    }

}, {

        navigationOptions: ({ navigation }) => ({
            title: 'Đăng nhập & đăng ký',
            headerStyle: {
                backgroundColor: '#EA8B26',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
            headerLeft: (
                <Icon name="ios-close" style={{ color: 'white', marginLeft: 10 }} onPress={() => navigation.navigate('User')} />
            ),
        })

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