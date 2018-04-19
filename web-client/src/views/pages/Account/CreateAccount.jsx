import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import Input from "../../components/Input";
import { createAccount, toast } from "../../../api";
class CreateAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentWillReceiveProps(nextProps) {
    if (
      this.props.submitting !== nextProps.submitting &&
      !nextProps.submitting &&
      nextProps.error
    ) {
      this.props.toast(nextProps.error, "error");
    }
  }
  render() {
    const { invalid, submitting, handleSubmit, token, toast } = this.props;
    return (
      <div className="container-fluid">
        <h3>CREATE EMPLOYEE ACCOUNT</h3>
        <div className="container">
          <div className="card">
            <form
              className="card-body p-5"
              onSubmit={handleSubmit(values =>
                createAccount(values, token, () => {
                  toast("ACCOUNT CREATED!", "success");
                })
              )}
            >
              <Field
                name="full_name"
                type="text"
                placeholder="Enter full name"
                label="Employee full name"
                component={Input}
              />
              <Field
                name="email"
                type="email"
                placeholder="Enter email"
                label="Email"
                component={Input}
              />
              <Field
                name="password"
                type="password"
                placeholder="Enter password"
                label="Password"
                component={Input}
              />
              <Field
                name="retypePassword"
                type="password"
                placeholder="Re-enter password"
                label="Re-enter password"
                component={Input}
                showError
                showErrorIf={error => error !== "Required"}
              />
              <Field
                name="phone_number"
                type="number"
                placeholder="Enter phone number"
                label="Phone number"
                component={Input}
              />
              <div className="form-group">
                <label>Role</label>
                <Field
                  name="role"
                  label="Role"
                  component="select"
                  className="form-control"
                >
                  <option defaultValue value="employee">
                    Employee
                  </option>
                  <option value="receptionist">Receiptionist</option>
                  <option value="manager">Manager</option>
                </Field>
              </div>
              <div className="d-flex justify-content-center mt-3">
                <button
                  className="btn btn-success"
                  disabled={invalid || submitting}
                >
                  {submitting ? (
                    <i className="fa fa-spinner fa-spin" />
                  ) : (
                    "ENROLL"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  token: state.user.token
});
const mapDispatchToProps = dispatch => ({
  toast: (message, level) => dispatch(toast(message, level))
});
const ReduxForm = reduxForm({
  form: "create_account_form",
  touchOnBlur: false,
  enableReinitialize: true,
  onSubmitFail: () => {},
  validate: values => {
    const errors = {};
    if (!values.email) errors.email = "Required";
    if (!values.password) errors.password = "Required";
    if (!values.retypePassword) errors.retypePassword = "Required";
    else if (values.retypePassword !== values.password)
      errors.retypePassword = "Password not match";
    if (!values.fullName) errors.fullName = "Required";
    if (!values.phoneNumber) errors.phoneNumber = "Required";
    return errors;
  }
})(CreateAccount);

export default connect(mapStateToProps, mapDispatchToProps)(ReduxForm);
