import _ from 'underscore'
import Instagram from "../lib/ig"
var instagram = new Instagram('68ce0c3b382b47f6ac392683aaceb00d');
if (window) window.instagram = instagram;

import classnames from 'classnames'
import React, { Component, PropTypes } from 'react';
const ReactCSSTransitionGroup = require('react-addons-css-transition-group');
import Gallery from './Gallery'
import Spinner from 'react-spinner'

require('../style.scss')
const offsetPerGallery = 280;

export default class Carouselle extends Component {

  static propTypes = {
    logIn: PropTypes.func.isRequired,
    logOut: PropTypes.func.isRequired,
  };

  constructor() {
    super()
    this.state = {selectedIndex: 0}
  }

  componentDidMount(){
    var self = this;

    if (instagram.accessToken && window.location.hash) {
      localStorage.accessToken = window.location.hash.replace('#', '').split('access_token=')[1]
      this.props.didLogIn()
      history.pushState("", document.title, window.location.pathname
                                                   + window.location.search);
    } else if (localStorage.accessToken) {
      this.props.didLogIn(localStorage.accessToken)
    } else {
      this.props.didLogOut()
    }

    this._addEventListeners()

    this._requestMore();
  }

  componentWillUnmount(){
    this._removeEventListeners()
  }

  _addEventListeners(){
    var self = this;
    this.wheel = _.throttle(function(e){
      if (self.props.galleries.length == 0) return;
      e.preventDefault();
      e.stopPropagation();
      var images = self.props.galleries[0].photos.length;
      if (e.deltaY > 0 || e.deltaX > 0) {
        self.props.jumpToPhoto(self.props.galleries[0], self.props.galleries[0].selectedIndex + 1)
      } else if (e.deltaY < 0 || e.deltaX < 0) {
        self.props.jumpToPhoto(self.props.galleries[0], self.props.galleries[0].selectedIndex - 1)
      }
    }, 100)
    this.resize = () => this.forceUpdate()
    this.keydown = function(e){
      if (self.props.galleries.length == 0) return;

      var images = self.props.galleries[0].photos.length;
      var newIndex = self.state.selectedIndex;

      switch (e.keyCode) {
        case 27:
          self.props.up()
          break;
        case 37: // left
          e.preventDefault();
          self.props.left(self.props.galleries[0])
          break;
        case 39:
          e.preventDefault();
          self.props.right(self.props.galleries[0])
          break;
        case 38:
          self.props.up()
          break;
        case 40:
          var userId = self.props.galleries[0].photos[self.props.galleries[0].selectedIndex].user.id
          self.props.down(userId)
          break;
      }

      if(newIndex < 0){
        newIndex = 0
      } else if(newIndex > images - 1) {
        newIndex = images - 1;
      }

      if (newIndex > images - 2) self._requestMore()

      self.setState({
        selectedIndex: newIndex
      });
    }
    window.addEventListener('resize', this.resize);
    document.addEventListener('wheel', this.wheel);
    document.addEventListener('keydown', this.keydown);
  }

  _removeEventListeners(){
    window.removeEventListener('resize', this.resize);
    document.removeEventListener('wheel', this.wheel);
    document.removeEventListener('keydown', this.keydown);
  }

  _requestMore(){
    var self = this;

    if (!instagram.accessToken){
      return;
    }

    // Get the most recent images of the current user, preloaded.
    var url;
    if(this.state.pagination && this.state.pagination.next_url) {
      url = this.state.pagination.next_url;
    } else {
      url = instagram.getUrl_("/users/self/media/recent");
    }

    if (this.state.requesting) return;
    this.setState({requesting: true});
  }

  _authenticate(){
    instagram.authenticate()
  }

  _loginButton(){
    if (this.props.user.loggingIn){
      return <div></div>
    }

    if (!this.props.user.loggedIn) {
      return <div id="login">
        <a href="#" className="sc-btn sc--instagram" onClick={this.props.logIn.bind(this)}>
          <span className="sc-icon">
              <svg viewBox="0 0 33 33" width="25" height="25" xmlns="http://www.w3.org/2000/svg" ><g><path d="M 26.688,0L 5.313,0 C 2.391,0,0,2.391,0,5.313l0,21.375 c0,2.922, 2.391,5.313, 5.313,5.313l 21.375,0 c 2.922,0, 5.313-2.391, 5.313-5.313L 32,5.313 C 32,2.391, 29.609,0, 26.688,0z M 10.244,14l 11.512,0 c 0.218,0.627, 0.338,1.3, 0.338,2c0,3.36-2.734,6.094-6.094,6.094c-3.36,0-6.094-2.734-6.094-6.094 C 9.906,15.3, 10.025,14.627, 10.244,14z M 28,14.002L 28,22 l0,4 c0,1.1-0.9,2-2,2L 6,28 c-1.1,0-2-0.9-2-2l0-4 L 4,14.002 L 4,14 l 3.128,0 c-0.145,0.644-0.222,1.313-0.222,2c0,5.014, 4.079,9.094, 9.094,9.094c 5.014,0, 9.094-4.079, 9.094-9.094 c0-0.687-0.077-1.356-0.222-2L 28,14 L 28,14.002 z M 28,7c0,0.55-0.45,1-1,1l-2,0 c-0.55,0-1-0.45-1-1L 24,5 c0-0.55, 0.45-1, 1-1l 2,0 c 0.55,0, 1,0.45, 1,1L 28,7 z"></path></g></svg>
          </span>
          <span className="sc-text">
            Log in with Instagram
          </span>
        </a>
        <br />
        <span>to see your photos</span>
      </div>
    } else {
      var user = this.props.user.user
      return <div id="login">
        {this.props.user.user && this.props.user.user.username &&
          <p>
            <img className="avatar" src={user.profile_picture} />
            Welcome back, <span className="author">{user.username}</span>
            <a href="#" className="sc-btn sc--instagram logout">
              <span className="sc-text" onClick={this.props.logOut.bind(this)}>Log out</span>
            </a>
          </p>
        }
      </div>
    }
  }

  render() {
    return (
      <div className="wrapper">
        <ReactCSSTransitionGroup transitionName="galleries" transitionEnterTimeout={300} transitionLeaveTimeout={300}>
          {this.props.galleries.map((gallery, galleryIndex) => {

            var style = {
              marginTop: (window.innerHeight / 2) - 180 - (offsetPerGallery * galleryIndex),
              marginLeft: (window.innerWidth - 1740) / 2,
              zIndex: 100 - galleryIndex,
              position: 'absolute',
              opacity: galleryIndex == 0 ? 1 : 1/((galleryIndex + 1) * (galleryIndex + 1))
            }

            return <div key={"gallery-wrapper:" + gallery.id.toString()} className={classnames("gallery-wrapper", {past: galleryIndex > 0})} style={style}>
              <Gallery
                key={"gallery:" + gallery.id.toString()}
                requesting={this.state.requesting}
                galleryIndex={galleryIndex}
                selectedIndex={gallery.selectedIndex}
                gallery={gallery}
                photos={gallery.photos}
                user={gallery.user}
                jumpToPhoto={this.props.jumpToPhoto}
                fetchPhotos={this.props.fetchPhotos}
                down={this.props.down}
              />
            </div>
          })}
        </ReactCSSTransitionGroup>
        {this._loginButton()}
      </div>
    )
  }
}
