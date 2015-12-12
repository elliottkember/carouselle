import _ from 'underscore';
import Spinner from 'react-spinner';
import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';

export default class Media extends Component {

  render(){
    const self = this;

    const {
      gallery,
      positionInView,
      down,
      up,
      key,
      imageUrl,
      videoUrl,
      showSpinner,
      selected,
      positionInGallery,
      user,
      caption,
      jumpToPhoto
    } = this.props;

    const noImage = !imageUrl && !videoUrl;

    const wrapperClass = classnames(
      "image-wrapper",
      {"no-image": !imageUrl && !videoUrl},
      {'selected': selected},
      {'left-hidden': positionInView == -3},
      {'right-hidden': positionInView == 3},
      {'invisible': positionInView > 3});

    const imageClass = classnames(
      'image',
      {'no-image': noImage},
      {'left-hidden': positionInView == -3},
      {'right-hidden': positionInView > 3}
    );

    return <div key={"wrapper:"+key} className={wrapperClass}>
      <div key={key} className={imageClass}>
        {imageUrl &&
          <img
            key={"img:" + key}
            onClick={jumpToPhoto}
            src={imageUrl} />
        }
        {videoUrl && selected &&
          <video
            key={"video:" + key}
            muted
            autoPlay
            loop
            controls
            width="100%"
            height="100%">
            <source src={videoUrl} type="video/mp4"/>
          </video>
        }
        {videoUrl && !selected &&
          <video
            key={"video:" + key}
            muted
            loop
            autoPlay
            controls
            width="100%"
            height="100%"
            style={{display: 'none'}}>
            <source src={videoUrl} type="video/mp4"/>
          </video>
        }
        {!imageUrl &&
          <div className="placeholder">
          </div>
        }
        {showSpinner &&
          <Spinner />
        }
      </div>

      {user &&
        <div className="user">
          <img src={user.profile_picture || user.profile_pic_url} />
          <a
            onClick={self.props.down.bind(null, user.id)}
            className="username">
            {user.username}
          </a>
          {selected && caption &&
            <span className="caption">
              {caption.text}
            </span>
          }
        </div>
      }

      {selected && gallery.type != 'user' && user &&
        <a
          onMouseDown={jumpToPhoto}
          href="#none"
          className="more">
          &darr; More photos by {user.username}
        </a>
      }
    </div>
  }
}
