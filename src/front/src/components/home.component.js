import React, { Component } from "react";

export default class Home extends Component {
  render() {
    return (
      <div>
        <h1>{this.props.firstname ? 'Hi ' + this.props.firstname : 'You are not logged in'}</h1>
      </div>
    )
  }
}
