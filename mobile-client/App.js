import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux'
import Loading from './components/loading'
import appReducer from './reducers'
import middleware from './middlewares'
import AppNavigation from './navigation'


const store = createStore(
  appReducer,
  applyMiddleware(middleware)
);

export default class App extends React.Component {

  state = {
    appLoaded: false
  }

  async componentWillMount() {
    await Expo.Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
    });
    setTimeout(() => this.setState({ appLoaded: true }), 2000)
  }

  render() {
    return this.state.appLoaded ?
      (
        <Provider store={store}>
          <AppNavigation />
        </Provider>
      ) : (<Loading />);

  }
}