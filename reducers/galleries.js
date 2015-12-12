import { UP, DOWN, LEFT, RIGHT, MORE_PHOTOS, JUMP, NEW_GALLERY, CLOSE_GALLERY, PHOTOS_RECEIVED, LOGGED_IN, LOGGED_OUT } from '../constants/ActionTypes';
var dummyData = require('../dummyData')
var _ = require('underscore')

const loggedInState = [
  {type: 'feed', id: 1, url: "/users/self/feed", selectedIndex: 0, type: 'feed', photos: []},
];

const loggedOutState = [
  {type: 'feed', id: 1, url: false, selectedIndex: 0, type: 'feed', photos: dummyData.user.media.nodes, user: dummyData.user}
];

export default function galleries(state = [], action) {
  var originalState = state;
  state = _.clone(state);
  switch (action.type) {

  case RIGHT:
    state = state.map(function(gallery, i){
      if(gallery == action.gallery && gallery.selectedIndex < gallery.photos.length - 1){
        gallery.selectedIndex = gallery.selectedIndex + 1
      }
      return gallery;
    })
    return state;

  case LOGGED_IN:
    state = loggedInState;
    return state;
  case LOGGED_OUT:
    return loggedOutState;


  case LEFT:
    state = state.map(function(gallery, i){
      if(gallery == action.gallery && gallery.selectedIndex > 0){
        gallery.selectedIndex = gallery.selectedIndex - 1
      }
      return gallery;
    })
    return state;

  case JUMP:
    var index = _.indexOf(originalState, action.gallery);

    state = state.map(function(gallery, i){
      if(gallery == action.gallery){
        gallery.selectedIndex = action.galleryIndex
      }
      return gallery;
    })

    state = state.slice(index, state.length);

    return state;
  case UP:
    if (state.length > 1){
      state = state.slice(1, state.length);
    }
    return state
  case DOWN:
    gallery = state[0];

    if(gallery.type != 'user'){
      var nextGallery = {
        url: "/users/"+action.userId+"/media/recent",
        photos: [],
        selectedIndex: 0,
        id: parseInt(Math.random() * 100),
        type: 'user'
      }
      state.unshift(nextGallery)
    } else {

    }
    return state;
  case MORE_PHOTOS:
    gallery = state[0];
    if (!gallery.photos) {gallery.photos = []}
    var images = gallery.photos.concat(action.photos);
    images = _.uniq(images, function(image){
      return image.id;
    });
    gallery.photos = images;
    gallery.url = action.nextUrl;
    return state;
  case NEW_GALLERY:
    var gallery = {
      name: action.galleryName,
      type: action.galleryType,
      url: action.galleryUrl
    }
    state.shift(gallery);
    return state;
  case CLOSE_GALLERY:
    state.pop();
    return state;
  default:
    return state;
  }
}
