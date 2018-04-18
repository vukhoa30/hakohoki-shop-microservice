import React, { Component } from "react";
import { connect } from "react-redux";
class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="container-fluid" >
        <div class="list-group">
          <a
            href="#"
            class="list-group-item list-group-item-action flex-column align-items-start active"
          >
            <div class="d-flex w-100 justify-content-between">
              <h5 class="mb-1">List group item heading</h5>
              <small>3 days ago</small>
            </div>
            <p class="mb-1">
              Donec id elit non mi porta gravida at eget metus. Maecenas sed
              diam eget risus varius blandit.
            </p>
            <small>Donec id elit non mi porta.</small>
          </a>
          <a
            href="#"
            class="list-group-item list-group-item-action flex-column align-items-start"
          >
            <div class="d-flex w-100 justify-content-between">
              <h5 class="mb-1">List group item heading</h5>
              <small class="text-muted">3 days ago</small>
            </div>
            <p class="mb-1">
              Donec id elit non mi porta gravida at eget metus. Maecenas sed
              diam eget risus varius blandit.
            </p>
            <small class="text-muted">Donec id elit non mi porta.</small>
          </a>
          <a
            href="#"
            class="list-group-item list-group-item-action flex-column align-items-start"
          >
            <div class="d-flex w-100 justify-content-between">
              <h5 class="mb-1">List group item heading</h5>
              <small class="text-muted">3 days ago</small>
            </div>
            <p class="mb-1">
              Donec id elit non mi porta gravida at eget metus. Maecenas sed
              diam eget risus varius blandit.
            </p>
            <small class="text-muted">Donec id elit non mi porta.</small>
          </a>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({});
export default connect(mapStateToProps, mapDispatchToProps)(Notification);
