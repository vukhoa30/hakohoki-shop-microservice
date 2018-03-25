import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux'
import Loading from './components/loading'
import appReducer from './reducers'
import reactNavigationMiddleware from './middlewares/react-navigation-middleware'
import AppNavigation from './navigation'
import thunk from 'redux-thunk'


const store = createStore(
  appReducer,
  applyMiddleware(reactNavigationMiddleware, thunk)
);

export default class App extends React.Component {

  state = {
    appLoaded: false
  }

  async componentWillMount() {
    await Expo.Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
      'Arial': require('./arial.ttf')
    });
    setTimeout(() => this.setState({ appLoaded: true }), 2000)
  }

  render() {
    return (
      <Provider store={store}>
        {this.state.appLoaded ? <AppNavigation /> : <Loading />}
      </Provider>
    )

  }
}