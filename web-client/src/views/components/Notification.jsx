import React, { Component } from "react";
import { connect } from "react-redux";
import NotificationSystem from "react-notification-system";
var style = {
  NotificationItem: { // Override the notification item
    DefaultStyle: { // Applied to every notification, regardless of the notification level
      margin: '10px 5px 2px 1px',
      width: '300px'
    },
  }
}

class Toast extends Component {
  _notificationSystem = null;

  addToast(message, level) {
    this._notificationSystem.addNotification({
      message,
      level,
      autoDismiss: 5,
      position: "tc",
    });
  }

  componentDidMount() {
    this._notificationSystem = this.refs.notificationSystem;
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.toast._id !== nextProps.toast._id) {
      const { message, level } = nextProps.toast;
      this.addToast(message, level);
    }
  }

  render() {
    return (
      <div>
        <NotificationSystem ref="notificationSystem" style={style} />
      </div>
    );
  }
}
const mapStateToProps = state => ({
  ...state.toast
});
const mapDispatchToProps = dispatch => ({});
export default connect(mapStateToProps, mapDispatchToProps)(Toast);
