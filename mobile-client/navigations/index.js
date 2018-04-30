import {
  TabNavigator,
  TabBarBottom,
  StackNavigator,
  TabBarTop,
  NavigationActions
} from "react-navigation";
import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import Home from "../views/screens/Home";
import Profile from "../views/screens/Profile";
import LogIn from "../views/screens/LogIn";
import SignUp from "../views/screens/SignUp";
import Activation from "../views/screens/Activation";
import Search from "../views/screens/Search";
import ProductInformation from "../views/screens/ProductInformation";
import ProductReviews from "../views/screens/ProductReviews";
import ProductComments from "../views/screens/ProductComments";
import Catalog from "../views/screens/Catalog";
import Cart from "../views/screens/Cart";
import Answers from "../views/screens/Answers";
import PromotionDetail from "../views/screens/PromotionDetail";
import WatchList from "../views/screens/WatchList";
import NotificationComponent from "../views/screens/Notification";
import TabBarIcon from "../views/components/TabBarIcon";
import { Icon } from "native-base";

const themeColor = '#BE2E11'

const ProductDetail = TabNavigator(
  {
    Information: {
      screen: ProductInformation
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
    tabBarPosition: "top",
    tabBarOptions: {
      upperCaseLabel: true,
      activeTintColor: "white",
      labelStyle: {
        fontWeight: "bold"
      },
      indicatorStyle: {
        backgroundColor: "white"
      },
      inactiveTintColor: "white",
      style: {
        backgroundColor: themeColor
      }
    }
  }
);

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
        title: 'Notification'
      }
    }
  },
  {
    /* The header config from HomeScreen is now here */
    initialRouteName: "Home",
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => (
        <TabBarIcon routeName={navigation.state.routeName} focused={focused} />
      )
    }),
    tabBarComponent: TabBarBottom,
    tabBarPosition: "bottom",
    tabBarOptions: {
      activeTintColor: "tomato",
      inactiveTintColor: "gray"
    },
    animationEnabled: true,
    swipeEnabled: true
  }
);
const Account = TabNavigator(
  {
    LogIn: {
      screen: LogIn
    },
    SignUp: {
      screen: SignUp
    }
  },
  {
    tabBarComponent: TabBarTop,
    tabBarPosition: "top",
    tabBarOptions: {
      upperCaseLabel: true,
      activeTintColor: "white",
      labelStyle: {
        fontWeight: "bold"
      },
      indicatorStyle: {
        backgroundColor: "white"
      },
      inactiveTintColor: "white",
      style: {
        backgroundColor: themeColor
      }
    }
  }
);

const rootNavigator = StackNavigator(
  {
    Main: {
      screen: mainNavigator,
      navigationOptions: {
        headerStyle: {
          backgroundColor: themeColor,
          elevation: 0,
          shadowOpacity: 0
        }
      }
    },

    Account: {
      screen: Account,
      navigationOptions: {
        title: "Account",
        headerStyle: {
          backgroundColor: themeColor,
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

    Catalog: {
      screen: Catalog
    },

    Search: {
      screen: Search
    },

    PromotionDetail: {
      screen: PromotionDetail,
      navigationOptions: {
        title: "Promotion"
      }
    },

    ProductDetail: {
      screen: ProductDetail,
      navigationOptions: ({ navigation }) => ({
        title: "Product detail",
        headerStyle: {
          backgroundColor: themeColor,
          elevation: 0,
          shadowOpacity: 0
        },
        headerTitleStyle: {
          color: "white"
        },
        headerTintColor: "white",
        headerRight: (
          <View style={{ flexDirection: "row" }}>
            <Icon
              name="cart"
              style={{ marginRight: 20, color: "white" }}
              onPress={() => navigation.navigate("Cart")}
            />
          </View>
        )
      })
    },

    Cart: {
      screen: Cart,
      navigationOptions: ({ navigation }) => ({
        title: "Cart",
        headerRight: <View />
      })
    },

    Answers: {
      screen: Answers,
      navigationOptions: {
        title: "Answers",
        headerRight: <View />
      }
    },

    WatchList: {
      screen: WatchList,
      navigationOptions: {
        title: "Watch list",
        headerRight: <View />
      }
    }
  },
  {
    navigationOptions: ({ navigation }) => ({
      headerStyle: {
        backgroundColor: themeColor
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontWeight: "bold"
      }
    })
  }
);

export default rootNavigator;
