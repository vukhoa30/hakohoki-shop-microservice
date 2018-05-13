import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import Input from "../../components/Input";
import Loader from "../../components/Loader";
import { code as errCode } from "../../../api/err-code";
import {
  createAccount,
  toast,
  loadAccounts,
  setAccountStatus
} from "../../../api";
const {
  UNKNOWN_ERROR,
  CONNECTION_ERROR,
  FORBIDDEN,
  INTERNAL_SERVER_ERROR,
  DATA_NOT_FOUND
} = errCode;
class AccountManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accountMode: "employee",
      selectedAccount: null,
      isSettingStatus: false
    };
    this.props.loadAccounts(this.props.token);
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
    const {
      invalid,
      submitting,
      handleSubmit,
      token,
      toast,
      account,
      loadAccounts
    } = this.props;
    const { isLoading, err, managers, employees, receptionists } = account;
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-5 col-xs-12">
            <div className="btn-group" role="group" aria-label="Basic example">
              <button
                type="button"
                onClick={() =>
                  this.setState({
                    accountMode: "employee",
                    selectedAccount: null
                  })
                }
                className={`btn ${
                  this.state.accountMode === "employee"
                    ? "btn-secondary"
                    : "btn-default"
                }`}
              >
                EMPLOYEE
              </button>
              <button
                type="button"
                onClick={() =>
                  this.setState({
                    accountMode: "receptionist",
                    selectedAccount: null
                  })
                }
                className={`btn ${
                  this.state.accountMode === "receptionist"
                    ? "btn-secondary"
                    : "btn-default"
                }`}
              >
                RECEPTIONIST
              </button>
              <button
                type="button"
                onClick={() =>
                  this.setState({
                    accountMode: "manager",
                    selectedAccount: null
                  })
                }
                className={`btn ${
                  this.state.accountMode === "manager"
                    ? "btn-secondary"
                    : "btn-default"
                }`}
              >
                MANAGER
              </button>
            </div>
            <div style={{ marginTop: 20 }}>
              {isLoading ? (
                <div className="text-center">
                  <Loader />
                </div>
              ) : err ? (
                <div
                  class="alert alert-danger clickable"
                  role="alert"
                  onClick={() => loadAccounts(token)}
                >
                  Could not load account data. Click to try again
                </div>
              ) : (
                <div>
                  <div
                    className="text-center"
                    style={{ width: "100%", position: "absolute" }}
                  >
                    <p style={{ color: "gray" }}>NO EMPLOYEES</p>
                  </div>
                  <div
                    style={{ width: "100%", height: 600, overflowY: "auto" }}
                  >
                    {(this.state.accountMode === "manager"
                      ? managers
                      : this.state.accountMode === "receptionist"
                        ? receptionists
                        : employees
                    ).map((account, index) => (
                      <a
                        key={"account-" + index}
                        href="javascript:;"
                        onClick={() =>
                          this.setState({ selectedAccount: account })
                        }
                        className="list-group-item list-group-item-action flex-column align-items-start pt-3 pb-5 mt-2"
                      >
                        <div className="row">
                          <div className="col-xs-2">
                            <img
                              src={`assets/img/${account.role ? account.role : 'employee'}.png`}
                              style={{ width: '100%', height: 'auto' }}
                            />
                          </div>
                          <div className="col-xs-10">
                            <div className="row">
                              <div className="col-xs-6">
                                {account.active ? (
                                  <p style={{ color: "green" }}>ACTIVE</p>
                                ) : (
                                  <p style={{ color: "gray" }}>DEACTIVE</p>
                                )}
                              </div>
                              <div className="col-xs-6 text-right">
                                {this.state.selectedAccount !== null &&
                                  this.state.selectedAccount.email ==
                                    account.email && (
                                    <i
                                      className="fa fa-circle"
                                      style={{ color: "red" }}
                                    />
                                  )}
                              </div>
                            </div>
                            <div className="form-group row clickable">
                              <label
                                htmlFor="staticEmail"
                                className="col-sm-5 col-form-label font-weight-bold"
                              >
                                Name
                              </label>
                              <div className="col-sm-7">
                                <input
                                  type="text"
                                  readOnly
                                  className="form-control-plaintext"
                                  defaultValue={account.fullName}
                                />
                              </div>
                            </div>
                            <div className="form-group row clickable">
                              <label
                                htmlFor="staticEmail"
                                className="col-sm-5 col-form-label font-weight-bold"
                              >
                                Email
                              </label>
                              <div className="col-sm-7">
                                <input
                                  type="text"
                                  readOnly
                                  className="form-control-plaintext"
                                  defaultValue={account.email}
                                />
                              </div>
                            </div>
                            <div className="form-group row clickable">
                              <label
                                htmlFor="staticEmail"
                                className="col-sm-5 col-form-label font-weight-bold"
                              >
                                Phone number
                              </label>
                              <div className="col-sm-7">
                                <input
                                  type="text"
                                  readOnly
                                  className="form-control-plaintext"
                                  defaultValue={account.phoneNumber}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                  <button
                    className={`btn btn-block mt-2 ${
                      this.state.selectedAccount === null
                        ? "btn-default"
                        : this.state.selectedAccount.active
                          ? "btn-secondary"
                          : "btn-success"
                    }`}
                    disabled={
                      this.state.selectedAccount === null ||
                      this.state.isSettingStatus
                    }
                    onClick={async () => {
                      this.setState({ isSettingStatus: true });
                      const result = await setAccountStatus(
                        this.state.selectedAccount.active
                          ? "deactivate"
                          : "reactivate",
                        this.state.selectedAccount.email,
                        token
                      );
                      if (result.ok) {
                        toast("SET ACCOUNT STATUS SUCCESSFULLY!", "success");
                        loadAccounts(token);
                      } else {
                        const { _error } = result;
                        switch (_error) {
                          case FORBIDDEN:
                            toast(
                              "YOU ARE NOT AUTHORIZED TO SET ACCOUNT STATUS",
                              "error"
                            );
                            break;
                          case INTERNAL_SERVER_ERROR:
                            toast(
                              "INTERNAL SERVER ERROR. TRY AGAIN LATER",
                              "error"
                            );
                            break;
                          case CONNECTION_ERROR:
                            toast(
                              "COULD NOT CONNECT TO SERVER. PLEASE CHECK YOUR CONNECTION",
                              "error"
                            );
                            break;
                          default:
                            toast(
                              "SOME ERROR OCCURS. TRY AGAIN LATER",
                              "error"
                            );
                            break;
                        }
                      }
                      this.setState({
                        isSettingStatus: false,
                        selectedAccount: null
                      });
                    }}
                  >
                    {this.state.isSettingStatus ? (
                      <i className="fa fa-spinner fa-spin" />
                    ) : this.state.selectedAccount === null ? (
                      "SELECT AN ACCOUNT"
                    ) : this.state.selectedAccount.active ? (
                      "DEACTIVE"
                    ) : (
                      "ACTIVE"
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="col-md-1 col-xs-12" />
          <div className="col-md-6 col-xs-12">
            <div className="card">
              <div className="header">
                <h3>CREATE EMPLOYEE ACCOUNT</h3>
              </div>
              <div className="content" style={{ padding: 20 }}>
                <form
                  className="card-body p-5"
                  onSubmit={handleSubmit(values =>
                    createAccount(values, token, () => {
                      toast("ACCOUNT CREATED!", "success");
                      loadAccounts(token);
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
                      className="form-control border-input"
                    >
                      <option defaultValue value="employee">
                        Employee
                      </option>
                      <option value="receptionist">Receptionist</option>
                      <option value="manager">Manager</option>
                    </Field>
                  </div>
                  <div className="text-center">
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
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  token: state.user.token,
  account: state.account,
  initialValues: {
    role: "employee"
  }
});
const mapDispatchToProps = dispatch => ({
  toast: (message, level) => dispatch(toast(message, level)),
  loadAccounts: token => dispatch(loadAccounts(token))
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
})(AccountManager);

export default connect(mapStateToProps, mapDispatchToProps)(ReduxForm);
