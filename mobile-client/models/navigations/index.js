import { TabNavigator, TabBarBottom, StackNavigator, TabBarTop, NavigationActions } from "react-navigation";
import React, { Component } from 'react';
import { StyleSheet, View, Text } from "react-native";
import Home from '../../views/Home'
import Profile from '../../views/Profile'
import LogIn from '../../views/LogIn'
import SignUp from '../../views/SignUp'
import Activation from '../../views/Activation'
import Categories from '../../views/Categories'
import ProductInformation from '../../views/ProductInformation'
import ProductReviews from '../../views/ProductReviews'
import ProductComments from '../../views/ProductComments'
import Cart from '../../views/Cart'
import Answers from '../../views/Answers'
import WatchList from '../../views/WatchList'
import NotificationComponent from '../../views/Notification'
import TabBarIcon from '../../views/TabBarIcon'
import { Icon } from "native-base";

const ProductDetail = TabNavigator(
    {
        Information: {
            screen: ProductInformation,
        },
        Reviews: {
            screen: ProductReviews
        },
        Comments: {
            screen: ProductComments
        }
    },
    {
        tabBarComponent: TabBarTop,
        tabBarPosition: 'top',
        tabBarOptions: {
            upperCaseLabel: true,
            activeTintColor: 'white',
            labelStyle: {
                fontWeight: 'bold'
            },
            indicatorStyle: {
                backgroundColor: 'white'
            },
            inactiveTintColor: 'white',
            style: {
                backgroundColor: 'blue'
            }
        }
    }
)

// const Product = StackNavigator(
//     {
//         List: {
//             screen: ProductList
//         },
//         Detail: {
//             screen: ProductDetail,
//             navigationOptions: ({ navigation }) => ({
//                 title: 'Product detail',
//                 headerStyle: {
//                     backgroundColor: '#1B7887',
//                     elevation: 0,
//                     shadowOpacity: 0
//                 },
//                 headerTitleStyle: {
//                     color: 'white'
//                 },
//                 headerTintColor: 'white',
//                 headerRight:
//                     <View style={{ flexDirection: 'row' }}>
//                         <Icon name='cart' style={{ marginRight: 20, color: 'white' }} onPress={() => navigation.navigate('Cart')} />
//                     </View>
//             })
//         }
//     },
//     {
//     }
// )

const mainNavigator = TabNavigator(

    {
        Home: {
            screen: Home
        },
        Profile: {
            screen: Profile
        },
        Notification: {
            screen: NotificationComponent,
            navigationOptions: {
                header: null
            }
        }
    },
    {
        /* The header config from HomeScreen is now here */
        initialRouteName: 'Home',
        navigationOptions: ({ navigation }) => ({

            tabBarIcon: ({ focused, tintColor }) => <TabBarIcon routeName={navigation.state.routeName} focused={focused} />

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
const Account = TabNavigator(
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
            upperCaseLabel: true,
            activeTintColor: 'white',
            labelStyle: {
                fontWeight: 'bold'
            },
            indicatorStyle: {
                backgroundColor: 'white'
            },
            inactiveTintColor: 'white',
            style: {
                backgroundColor: 'blue'
            }
        }
    }
)

const rootNavigator = StackNavigator({

    Main: {
        screen: mainNavigator,
        navigationOptions: {
            headerStyle: {
                backgroundColor: 'blue',
                elevation: 0,
                shadowOpacity: 0
            },
        }
    },

    Account: {
        screen: Account,
        navigationOptions: {
            title: 'Account',
            headerStyle: {
                backgroundColor: 'blue',
                elevation: 0,
                shadowOpacity: 0
            },
            headerRight: <View />
        }
    },

    Activation: {
        screen: Activation,
        navigationOptions: {
            headerRight: <View />
        }
    },

    ProductDetail: {
        screen: ProductDetail,
        navigationOptions: ({ navigation }) => ({
            title: 'Product detail',
            headerStyle: {
                backgroundColor: 'blue',
                elevation: 0,
                shadowOpacity: 0
            },
            headerTitleStyle: {
                color: 'white'
            },
            headerTintColor: 'white',
            headerRight:
                <View style={{ flexDirection: 'row' }}>
                    <Icon name='cart' style={{ marginRight: 20, color: 'white' }} onPress={() => navigation.navigate('Cart')} />
                </View>
        })
    },

    Cart: {
        screen: Cart,
        navigationOptions: ({ navigation }) => ({
            title: 'Cart',
            headerRight: <View />
        })
    },

    Answers: {
        screen: Answers,
        navigationOptions: {
            title: 'Answers',
            headerRight: <View />
        }
    },

    WatchList: {
        screen: WatchList,
        navigationOptions: {
            title: 'Watch list',
            headerRight: <View />
        }
    }

}, {

        navigationOptions: ({ navigation }) =>
            ({
                headerStyle: {
                    backgroundColor: 'blue',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                }
            })

    })


export default rootNavigator