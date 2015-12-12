import _ from 'underscore';
import Spinner from 'react-spinner';
import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import '../style.scss';
const offsetPerGallery = 240;
import Media from './Media';

export default class Gallery extends Component {

  componentDidMount(){
    if (this.props.gallery || this.props.photos.length == 0){
      this.props.fetchPhotos(this.props.gallery.url, this.props.gallery)
    }
  }

  componentDidUpdate(oldProps, oldState){
    if (oldProps.gallery != this.props.gallery){
      this.props.fetchPhotos(this.props.gallery.url, this.props.gallery)
    }
  }

  emptyTimeline(){
    return <div>
      <div className="image-wrapper">
        <div className="image">
        </div>
      </div>
      <div className="image-wrapper">
        <div className="image">
        </div>
      </div>
      <div className="image-wrapper selected none">
        <div className="image">
          <Spinner />
        </div>
      </div>
    </div>
  }

  timeline(){
    var {
      galleryIndex,
      gallery,
      photos,
      selectedIndex
    } = this.props;

    return [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7].map( (i) => {
      var photo = photos[selectedIndex + i];
      var key = "key:" + this.props.key + (i  + selectedIndex)
      var selected = i == 0;
      var loadingNext = (i == 1 && this.props.requesting && !photo && !loadingAll)
      var loadingAll = (i == 0 && loadingAll);
      var imageUrl;
      if (photo){
        imageUrl = photo.images ? photo.images.standard_resolution.url : photo.display_src;
      } else {
        photo = {}
      }

      var jumpToPhoto;
      if (selected && photo && photo.user) {
        jumpToPhoto = this.props.down.bind(this, photo.user.id)
      } else if (gallery) {
        jumpToPhoto = this.props.jumpToPhoto.bind(this, gallery, i+selectedIndex)
      }

      return <Media
          selected={selected}
          key={key}
          imageUrl={imageUrl}
          videoUrl={photo.videos && photo.videos.standard_resolution.url}
          showSpinner={loadingNext || loadingAll}
          positionInView={i}
          down={this.props.down}
          up={this.props.up}
          gallery={gallery}
          positionInGallery={i+selectedIndex}
          jumpToPhoto={jumpToPhoto}
          user={photo ? photo.user : {}}
          caption={photo ? photo.caption : {}}
        />
      }
    )
  }

  render(){
    return (
      <div className="gallery" key={"gallery:" + this.props.key}>
        {this.props.photos.length == 0 ? this.emptyTimeline() : this.timeline()}
      </div>
    );
  }
}
