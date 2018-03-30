import { TabNavigator, TabBarBottom, StackNavigator, TabBarTop } from "react-navigation";
import React, { Component } from 'react';
import { StyleSheet } from "react-native";
import Home from '../../views/Home'
import Profile from '../../views/Profile'
import LogIn from '../../views/LogIn'
import SignUp from '../../views/SignUp'
import Activation from '../../views/Activation'
import Categories from '../../views/Categories'
import ProductList from '../../views/ProductList'
import ProductInformation from '../../views/ProductInformation'
import ProductReviews from '../../views/ProductReview'
import ProductQA from '../../views/ProductQA'
import { Icon } from "native-base";

const mainNavigator = TabNavigator(

    {
        Home: {
            screen: Home
        },
        Profile: {
            screen: Profile
        },
        Categories: {
            screen: Categories
        }
    },
    {
        /* The header config from HomeScreen is now here */
        initialRouteName: 'Home',
        navigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ focused, tintColor }) => {
                const { routeName } = navigation.state;
                switch (routeName) {

                    case 'Home':
                        return <Icon name={focused ? 'ios-home' : 'ios-home-outline'} style={styles.icon} />
                    case 'Profile':
                        return <Icon name={focused ? 'ios-person' : 'ios-person-outline'} style={styles.icon} />
                    case 'Categories':
                        return <Icon name={focused ? 'ios-apps' : 'ios-apps-outline'} style={styles.icon} />
                    default:
                        return <Icon name='ios-information-circle-outline' style={styles.icon} />

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

)

const productDetailNavigator = TabNavigator(
    {
        ProductInformation: {
            screen: ProductInformation,
        },
        ProductReviews: {
            screen: ProductReviews,
        },
        ProductQA: {
            screen: ProductQA,
        }
    },
    {
        tabBarComponent: TabBarTop,
        tabBarPosition: 'top',
        tabBarOptions: {
            upperCaseLabel: false
        }
    }
)

const accountNavigator = TabNavigator(
    {
        LogIn: {
            screen: LogIn,
        },
        SignUp: {
            screen: SignUp,
        }
    },
    {
        tabBarComponent: TabBarTop,
        tabBarPosition: 'top',
        tabBarOptions: {
            upperCaseLabel: false
        }
    }
)

const appNavigator = StackNavigator({

    Main: {
        screen: mainNavigator
    },

    Account: {
        screen: accountNavigator,
        navigationOptions: { title: 'Account' }
    },

    Activation: {
        screen: Activation
    },

    ProductList: {
        screen: ProductList
    },

    ProductDetail: {
        screen: productDetailNavigator,
        navigationOptions: { title: 'Product detail' }
    }


}, {
    })

const styles = StyleSheet.create({

    icon: {
        fontSize: 20,
        color: 'red'
    }

})

export default appNavigator