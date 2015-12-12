import React, { Component } from 'react';
import CarouselleApp from './CarouselleApp';
import { combineReducers } from 'redux';
import { Provider } from 'react-redux';

import { createStore, applyMiddleware, compose } from 'redux';
import { persistState } from 'redux-devtools';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
import DevTools from '../containers/DevTools';

const finalCreateStore = compose(
  applyMiddleware(thunk),
  DevTools.instrument(),
  persistState(
    window.location.href.match(
      /[?&]debug_session=([^&]+)\b/
    )
  )
)(createStore);

export default function configureStore(initialState) {
  const store = finalCreateStore(rootReducer, initialState);

  if (module.hot) {
    module.hot.accept('../reducers', () =>
      store.replaceReducer(require('../reducers'))
    );
  }

  return store;
}

const store = configureStore();

export default class App extends Component {
  render() {
    const {store} = this.props;
    return (
      <Provider store={store}>
        <div>
          <CarouselleApp />
          {document.location.host == 'localhost:3000' &&
            <DevTools />
          }
        </div>
      </Provider>
    );
  }
}
