import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Carouselle from '../components/Carouselle';
import * as CarouselleActions from '../actions/CarouselleActions';

function mapStateToProps(state) {
  return state;
}

const allActions = {}
Object.assign(allActions, CarouselleActions)

function mapDispatchToProps(dispatch) {
  return bindActionCreators(allActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Carouselle);
