import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
class Answer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return <div />;
  }
}
const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({});
const ReduxForm = reduxForm({
  form: "answer_form",
  touchOnBlur: false,
  enableReinitialize: true,
  onSubmitFail: () => {},
  validate: values => {
    const errors = {};

    return errors;
  }
})(Answer);

export default connect(mapStateToProps, mapDispatchToProps)(ReduxForm);
