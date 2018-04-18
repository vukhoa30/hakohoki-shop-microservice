import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import Input from "../components/Input";
import { authenticate, toast, logIn } from "../../api";
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    if (props.location.state) props.toast("PLEASE LOG IN FIRST", "warning");
  }
  render() {
    const {
      invalid,
      submitting,
      handleSubmit,
      error,
      logIn,
      history,
      location
    } = this.props;
    return (
      <div className="container d-flex justify-content-center">
        <div style={{ width: "50%" }}>
          <div className="card p-5">
            <div className="card-body">
              <div className="d-flex justify-content-center">
                <img
                  src="https://vignette.wikia.nocookie.net/feud8622/images/2/2d/User_admin_gear.png/revision/latest?cb=20170219231928"
                  alt=""
                  style={{
                    marginTop: 20,
                    marginBottom: 20,
                    width: 300,
                    height: 300
                  }}
                />
              </div>
              {error && <p style={{ color: "red" }}>{error}</p>}
              <form
                onSubmit={handleSubmit(values =>
                  authenticate(values, (account, token) => {
                    logIn(account, token);
                    history.push(
                      location.state ? location.state.from : "/main"
                    );
                  })
                )}
              >
                <Field
                  name="email"
                  type="email"
                  label="Email"
                  placeholder="Enter email"
                  component={Input}
                />
                <Field
                  name="password"
                  type="password"
                  label="Password"
                  placeholder="Enter password"
                  component={Input}
                />
                <button
                  type="submit"
                  className="btn btn-primary btn-block mt-5"
                  disabled={invalid || submitting}
                >
                  {submitting ? (
                    <i className="fa fa-spinner fa-spin fa-2x" />
                  ) : (
                    "LOG IN"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({
  toast: (message, level) => dispatch(toast(message, level)),
  logIn: (account, token) => dispatch(logIn(account, token))
});
const ReduxForm = reduxForm({
  form: "login_form",
  touchOnBlur: false,
  enableReinitialize: true,
  onSubmitFail: () => {},
  validate: values => {
    const errors = {
      email: values.email ? undefined : "Required",
      password: values.password ? undefined : "Required"
    };
    return errors;
  }
})(Login);

export default connect(mapStateToProps, mapDispatchToProps)(ReduxForm);
