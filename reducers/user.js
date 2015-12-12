import { LOGGING_IN, LOGGED_IN, LOGGED_OUT } from '../constants/ActionTypes';

const initialState = {
  loggedIn: false,
  user: {}
};

const initialStateLoggedIn = {
  loggedIn: true,
  user: {
    username: "Elliott Kember",
    profile_picture: "laksjdf"
  }
};

var _ = require('underscore')
export default function user(state = {}, action) {
  state = _.clone(state)
  switch (action.type) {
    case LOGGED_IN:
      state.loggedIn = true
      state.loggingIn = false
      state.user = action.user
      return state;
    case LOGGING_IN:
      state.loggedIn = true
      state.loggingIn = true
      state.user = {}
      return state;
    case LOGGED_OUT:
      state.loggedIn = false
      state.loggingIn = false
      state.user = {}
      return state;
    default:
      return state;

  //   var timeline = action.timeline;
  //   var photos = action.photos;
  //
  //   if (!state[timeline]) state[timeline] = []
  //   images = state[timeline].concat(photos)
  //   images = _.uniq(images, function(image){
  //     return image.id;
  //   });
  //
  //   state[timeline] = images
  //   return state;
  // default:
  //   return state;
  }
}
