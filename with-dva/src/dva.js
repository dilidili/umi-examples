import { message } from 'antd';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

export function config() {
  return {
    onError(err) {
      err.preventDefault();
      message.error(err.message);
    },
    initialState: {
      global: {
        text: 'hi umi + dva',
      },
    },
  };
}

export function appEnhancer(app) {
  const persistConfig = {
    key: 'root',
    storage,
  }

  const persistEnhancer = storeCreator => (
    reducer,
    preloadedState,
    enhancer
  ) => {
    let store = storeCreator(reducer, preloadedState, enhancer);
    store._reduxPersistor = persistStore(store);
    return store;
  };

  app.use({
    extraEnhancers: [...(app._plugin.get('extraEnhancers') || []), persistEnhancer],
    onReducer: reducer => persistReducer(persistConfig, reducer)
  });
}


