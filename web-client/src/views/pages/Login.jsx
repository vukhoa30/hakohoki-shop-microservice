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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 100
        }}
      >
        <div style={{ width: "70%" }}>
          <div className="card">
            <div className="content row" style={{ padding: 100 }}>
              <div className="col-xs-5"  style={{ borderRight: "1px solid #CBC5C5" }} >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
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
              </div>
              <div className="col-xs-1"></div>
              <div className="col-xs-6" style={{ paddingLeft: 20 }} >
                <h3>MEMBER LOGIN</h3>
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
                    className="btn btn-success btn-block btn-fill"
                    disabled={invalid || submitting}
                  >
                    {submitting ? (
                      <i className="fa fa-circle-o-notch fa-spin fa-2x" />
                    ) : (
                      "LOG IN"
                    )}
                  </button>
                </form>
              </div>
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
