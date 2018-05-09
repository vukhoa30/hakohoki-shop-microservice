import React, { Component } from "react";
import { connect } from "react-redux";
import { Modal } from "react-bootstrap";
class ConfirmDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { title, content, isOpen, onResult } = this.props;
    return (
      <Modal show={isOpen}>
        <Modal.Header>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{content}</Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-primary btn-fill"
            onClick={() => onResult(true)}
          >
            YES
          </button>
          <button
            className="btn btn-default btn-fill"
            onClick={() => onResult(false)}
          >
            NO
          </button>
        </Modal.Footer>
      </Modal>
    );
  }
}
const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({});
export default connect(mapStateToProps, mapDispatchToProps)(ConfirmDialog);
