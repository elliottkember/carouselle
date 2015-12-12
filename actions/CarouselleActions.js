import * as types from '../constants/ActionTypes';
import Instagram from "../lib/ig"
var instagram = window.instagram; //  new Instagram('68ce0c3b382b47f6ac392683aaceb00d');

export function didLogOut(){
  return {
    type: types.LOGGED_OUT
  }
}

export function didLogIn(accessToken){
  if (accessToken){
    instagram.accessToken = accessToken
  }
  return function(dispatch){

    dispatch({
      type: types.LOGGING_IN
    })

    Instagram.jsonp_(instagram.getUrl_("/users/self"), function (response) {
      dispatch({
        type: types.LOGGED_IN,
        user: response.data
      })
    });
  }
}

export function left(gallery) {
  return {
    type: types.LEFT,
    gallery: gallery
  }
}

export function right(gallery) {
  return function(dispatch){
    if (gallery.selectedIndex >= gallery.photos.length - 2) {
      dispatch(fetchPhotos(gallery.url, gallery));
    }
    dispatch({
      type: types.RIGHT,
      gallery: gallery
    });
  }
}

export function up() {
  return {
    type: types.UP
  }
}

export function down(userId) {
  return {
    type: types.DOWN,
    userId: userId
  }
}

export function jumpToPhoto(gallery, galleryIndex) {
  return function(dispatch){
    if (galleryIndex < 0){
      galleryIndex = 0
    } else if(galleryIndex > gallery.photos.length - 1) {
      galleryIndex = gallery.photos.length - 1
    }

    if (galleryIndex > gallery.photos.length - 2) {
      dispatch(fetchPhotos(gallery.url, gallery));
    }

    dispatch({
      type: types.JUMP,
      gallery: gallery,
      galleryIndex: galleryIndex
    });
  }
}

export function logIn(user) {
  instagram.authenticate()
  return {
    type: types.LOGGING_IN
  }
}

export function logOut(user) {
  delete localStorage.accessToken
  window.location.reload()
  return {
    type: types.LOGGED_OUT,
    user: user
  }
}

export function fetchPhotos(url, gallery){
  // debugger

  return function(dispatch){

    if (!url) {
      return
    }
    url = url.replace(instagram.getUrl_("/"), "")
    // debugger

    if (!url.match('instagram.com')){
      url = instagram.getUrl_(url);
    }

    Instagram.jsonp_(url, function(response){

      if (!response.pagination){
        return;
      }

      // debugger
      var nextUrl = response.pagination.next_url.replace(instagram.getUrl_("/"), "")

      dispatch({
        type: types.MORE_PHOTOS,
        gallery: gallery,
        photos: response.data,
        response: response,
        nextUrl: nextUrl
      });
    })
  }
}
