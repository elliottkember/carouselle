// export { default as someapp } from './someapp';

import { combineReducers } from 'redux';
import galleries from './galleries';
import user from './user';

const rootReducer = combineReducers({
  galleries, user
});

export default rootReducer;
