import { Store } from '@maksimr/ui/Store';
import { produce } from 'immer';
import { normalize } from 'normalizr';
/**
 * @typedef AppStore
 * @property {string} [path]
 * @property {Object} [entities]
 * @property {Object} [view]
 */

export const store = new Store(
  /** @type {AppStore} */
  ({
    path: '/',
    entities: {},
    view: {
      '/': {}
    }
  }),
  (it, fn) => produce(it, fn)
);

export const updatePath = (path) => {
  store.swap((state) => {
    state.path = path;
    state.view[path] = state.view[path] || {};
  });
};

export const updateEntities = (data, schem) => {
  const result = normalize(data, schem);
  store.swap((/** @type {AppStore} */ state) => {
    Object.entries(result.entities).forEach(([key, entities]) => {
      state.entities[key] = {
        ...state.entities[key],
        ...entities
      };
    });
  });
  return result.result;
};
