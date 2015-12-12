import { PHOTOS_RECEIVED } from '../constants/ActionTypes';

const initialState = {};

export default function receive(state = initialState, action) {
  switch (action.type) {
  case PHOTOS_RECEIVED:
    var timeline = action.timeline;
    var photos = action.photos;

    if (!state[timeline]) state[timeline] = []
    images = state[timeline].concat(photos)
    images = _.uniq(images, function(image){
      return image.id;
    });

    state[timeline] = images
    return state;
  default:
    return state;
  }
}
