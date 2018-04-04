import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import thunk from 'redux-thunk'
import { reactNavigationReduxMiddleware } from './presenters/middleware'
import AppNavigation from './views/AppNavigation'
import Loading from './views/Loading'
import appReducer from './models/states'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux';
import { Container } from "native-base";
import { createLogger } from 'redux-logger'

const store = createStore(
  appReducer,
  //applyMiddleware(reactNavigationReduxMiddleware, thunk, createLogger({ stateTransformer: state => state.product.current }))
  applyMiddleware(reactNavigationReduxMiddleware, thunk)
);


export default class App extends React.Component {
  state = {
    appLoaded: false
  }

  async componentWillMount() {
    await Expo.Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf')
    });
    this.setState({ appLoaded: true })
  }
  render() {
    return (
      <Container>
        <Provider store={store}>
          {this.state.appLoaded ? <AppNavigation /> : <Loading />}
        </Provider>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
