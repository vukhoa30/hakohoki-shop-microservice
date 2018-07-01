import React, { Component } from "react";
import { connect } from "react-redux";
import {
  formatTime,
  currencyFormat,
  parseToObject,
  parseToQueryString,
  request
} from "../../../utils";
import {
  searchForBills,
  getBill,
  toast,
  confirmBill,
  confirmBillOnState,
  setBillAsRead
} from "../../../api";
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import Bill from "../../components/Bill";
import Loader from "../../components/Loader";
import BillDetail from "../../components/BillDetail";
import { findDOMNode } from "react-dom";
import { transform, reduce } from "lodash";

class BillList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedBillLoading: false,
      selectedBillErr: false,
      mode: "pending",
      begin: null,
      end: moment(),
      selectedBill: null,
      searchingForBill: false,
      confirmingBill: false
    };
    const { token, searchForBills } = props;
    searchForBills("?status=pending", "pending", token);
    searchForBills("?status=completed", "completed", token);
  }

  componentDidMount() {
    const { billId } = this.props;
    if (billId !== null) this.loadSelectedBill();
  }

  loadSelectedBill() {
    const { billId, token } = this.props;
    this.setState({
      selectedBillLoading: true,
      selectedBill: null,
      selectedBillErr: false
    });
    getBill(billId, token).then(result => {
      if (result.ok)
        this.setState({
          selectedBill: result.data,
          selectedBillLoading: false
        });
      else this.setState({ selectedBillLoading: false, selectedBillErr: true });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.billId !== prevProps.billId &&
      (this.state.selectedBill !== null &&
        this.state.selectedBill._id !== this.props.billId)
    ) {
      this.loadSelectedBill();
    }
  }

  getInfoName(key) {
    let name = "";
    switch (key) {
      case "accountId":
        name = "ID";
        break;
      case "fullName":
        name = "Name";
        break;
      case "email":
        name = "Email";
        break;
      case "phoneNumber":
      case "phoneNumner":
        name = "Phone";
        break;
    }
    return name;
  }

  selectBill(bill) {
    if (bill.new) this.props.setBillAsRead(bill._id);
    this.setState({
      selectedBill: {
        ...bill,
        products: transform(
          bill.specificProducts,
          (result, cur) => {
            const element = result.find(
              product => product.productName === cur.productName
            );
            if (element) {
              element.specifics.push(cur.id);
            } else {
              result.push({
                productName: cur.productName,
                price: cur.price,
                specifics: [cur.id],
                mainPicture: cur.mainPicture,
                giftProducts: cur.specificGifts
              });
            }
            return result;
          },
          []
        )
      }
    });
    this.props.history.push({
      ...this.props.location,
      search: "?selected_bill_id=" + bill._id
    });
  }

  render() {
    const {
      upcoming,
      completed,
      search,
      token,
      searchForBills,
      location,
      handleSubmit,
      history,
      toast,
      role,
      confirmBillOnState,
      account
    } = this.props;
    const {
      selectedBill,
      confirmingBill,
      mode,
      selectedBillErr,
      selectedBillLoading
    } = this.state;
    return (
      <div className="container-fluid">
        {/* {role === "receptionist" && (
          <button className="btn btn-success mb-3">
            <i className="fa fa-plus mr-3" />
            CREATE A BILL
          </button>
        )} */}
        {/* <form
          className="form-inline"
          style={{ marginTop: 10 }}
          onSubmit={async e => {
            e.preventDefault();
            if (this.state.searchingForBill) return;
            this.setState({ searchingForBill: true });
            const result = await getBill(this.billId.value, token);
            if (result.ok) {
              selectBill(result.data);
            } else {
              if (result.status === 401)
                toast(`YOU ARE NOT AUTHORIZED TO SEE BILL DATA`, "error");
              else toast(`INTERNAL SERVER ERROR OR BILL NOT EXISTED`, "error");
            }
            this.setState({ searchingForBill: false });
          }}
        >
          <div className="form-group" style={{ width: "90%" }}>
            <input
              ref={ref => (this.billId = ref)}
              type="text"
              className="form-control border-input"
              placeholder="Looking for bill by ID"
              style={{
                width: "100%",
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0
              }}
              required
            />
          </div>
          <button
            className="btn btn-default"
            type="submit"
            disabled={this.state.searchingForBill}
            style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
          >
            {this.state.searchingForBill ? (
              <i className="fa fa-circle-o-notch fa-spin" />
            ) : (
              <i className="fa fa-search" />
            )}
          </button>
        </form> */}
        <div className="row mt-3">
          <div className="col-md-4 col-xs-12">
            <ul className="nav nav-tabs">
              <li className={mode === "pending" ? "active" : ""}>
                <a
                  href="javascript:;"
                  onClick={() => this.setState({ mode: "pending" })}
                >
                  <b>Pending</b>
                </a>
              </li>
              <li className={mode === "completed" ? "active" : ""}>
                <a
                  href="javascript:;"
                  onClick={() => this.setState({ mode: "completed" })}
                >
                  <b>Completed</b>
                </a>
              </li>
              <li className={mode === "search" ? "active" : ""}>
                <a
                  href="javascript:;"
                  onClick={() => this.setState({ mode: "search" })}
                >
                  <b>Search</b>
                </a>
              </li>
            </ul>
            <div style={{ width: "100%" }}>
              {mode === "search" ? (
                <div>
                  <form
                    style={{ marginTop: 10, marginBottom: 10 }}
                    onSubmit={e => {
                      e.preventDefault();
                      const { buyer, criteria, begin, end } = e.target;
                      const user =
                        buyer.value !== ""
                          ? {
                              accountId:
                                criteria.value === "by_id"
                                  ? buyer.value
                                  : undefined,
                              fullName:
                                criteria.value === "by_name"
                                  ? buyer.value
                                  : undefined,
                              email:
                                criteria.value === "by_email"
                                  ? buyer.value
                                  : undefined,
                              phoneNumber:
                                criteria.value === "by_phone"
                                  ? buyer.value
                                  : undefined
                            }
                          : {};
                      const searchObj = {
                        ...user,
                        begin:
                          begin.value !== ""
                            ? new Date(begin.value)
                            : undefined,
                        end: end.value !== "" ? new Date(end.value) : undefined
                      };
                      const queryString = parseToQueryString(searchObj);
                      searchForBills(
                        queryString !== "" ? "?" + queryString : "",
                        "search",
                        token
                      );
                    }}
                  >
                    <div style={{ display: "flex" }}>
                      <div className="form-group" style={{ flex: 2 }}>
                        <input
                          name="buyer"
                          type="text"
                          placeholder="SEARCH FOR BUYER"
                          className="form-control border-input"
                          style={{
                            borderTopRightRadius: 0,
                            borderBottomRightRadius: 0
                          }}
                        />
                      </div>
                      <div className="form-group" style={{ flex: 1 }}>
                        <select
                          name="criteria"
                          className="form-control border-input"
                          style={{
                            borderTopLeftRadius: 0,
                            borderBottomLeftRadius: 0
                          }}
                        >
                          <option value="by_id">BY ID</option>
                          <option value="by_name">BY NAME</option>
                          <option value="by_email">BY EMAIL</option>
                          <option value="by_phone">BY PHONE NUMBER</option>
                        </select>
                      </div>
                    </div>
                    <div
                      className="form-horizontal"
                      style={{ display: "flex" }}
                    >
                      <div className="form-group" style={{ flex: 1 }}>
                        <label className="control-label col-sm-2">From</label>
                        <div className="col-sm-10">
                          <input
                            name="begin"
                            type="date"
                            placeholder="SEARCH FOR BUYER"
                            className="form-control border-input"
                            style={{
                              borderTopRightRadius: 0,
                              borderBottomRightRadius: 0
                            }}
                          />
                        </div>
                      </div>
                      <div
                        className="form-group"
                        style={{ flex: 1, paddingLeft: 10 }}
                      >
                        <label className="control-label col-sm-2 text-right">
                          To
                        </label>
                        <div className="col-sm-10">
                          <input
                            name="end"
                            type="date"
                            placeholder="SEARCH FOR BUYER"
                            className="form-control border-input"
                            style={{
                              borderTopRightRadius: 0,
                              borderBottomRightRadius: 0
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <button
                        disabled={search.isLoading}
                        type="submit"
                        className="btn btn-success btn-fill"
                      >
                        SEARCH
                      </button>
                    </div>
                  </form>
                  {search.isLoading && (
                    <div className="text-center">
                      <Loader />
                    </div>
                  )}
                  {search.err !== null ? (
                    <div className="text-center">
                      <p style={{ color: "red" }}>
                        LOAD DATA FAILED! CLICK SEARCH TO LOAD AGAIN
                      </p>
                    </div>
                  ) : search.data.length === 0 ? (
                    !search.isLoading &&
                    search.err === null && (
                      <div className="text-center">
                        <p style={{ color: "gray" }}>NO DATA FOUND</p>
                      </div>
                    )
                  ) : (
                    <div style={{ height: 500, overflowY: "auto" }}>
                      {search.data.map(bill => (
                        <Bill
                          key={"searched-bill-" + bill._id}
                          bill={bill}
                          selectBill={() => this.selectBill(bill)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : mode === "pending" ? (
                <div style={{ width: "100%", height: 600, overflowY: "auto" }}>
                  {upcoming.err !== null && (
                    <div
                      className="alert alert-danger clickable"
                      role="alert"
                      onClick={() =>
                        searchForBills("?status=pending", "pending", token)
                      }
                    >
                      COULD NOT LOAD DATA. CLICK TO TRY AGAIN
                    </div>
                  )}
                  {upcoming.isLoading ? (
                    <div className="text-center">
                      <Loader />
                    </div>
                  ) : upcoming.data.length > 0 ? (
                    <div className="list-group" style={{ borderTopWidth: 0 }}>
                      {upcoming.data.map(bill => (
                        <Bill
                          key={"upcoming-bill-" + bill._id}
                          bill={bill}
                          selectBill={() => this.selectBill(bill)}
                        />
                      ))}
                    </div>
                  ) : (
                    upcoming.err === null && (
                      <div className="d-flex justify-content-center mt-5">
                        <p style={{ color: "gray" }}>NO BILL FOUND</p>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div style={{ height: 600, overflowY: "auto" }}>
                  {completed.err !== null && (
                    <div
                      className="alert alert-danger clickable"
                      role="alert"
                      onClick={() =>
                        searchForBills("?status=completed", "completed", token)
                      }
                    >
                      COULD NOT LOAD DATA. CLICK TO TRY AGAIN
                    </div>
                  )}
                  {completed.isLoading ? (
                    <div className="text-center">
                      <Loader />
                    </div>
                  ) : completed.data.length > 0 ? (
                    <div className="list-group" style={{ borderTopWidth: 0 }}>
                      {completed.data.map(bill => (
                        <Bill
                          key={"completed-bill-" + bill._id}
                          bill={bill}
                          selectBill={() => this.selectBill(bill)}
                        />
                      ))}
                    </div>
                  ) : (
                    completed.err === null && (
                      <div className="d-flex justify-content-center mt-5">
                        <p style={{ color: "gray" }}>NO BILL FOUND</p>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
          <div
            className="col-md-8 col-xs-12"
            style={{ backgroundColor: "white" }}
          >
            {selectedBillLoading ? (
              <div className="text-center">
                <Loader />
              </div>
            ) : selectedBillErr ? (
              <div
                className="alert alert-danger"
                onClick={() => this.loadSelectedBill()}
              >
                ERROR IN LOADING BILL! CLICK TO TRY AGAIN
              </div>
            ) : (
              selectedBill !== null && (
                <BillDetail
                  key="bill-detail"
                  selectedBill={selectedBill}
                  confirmCompleted={() => {
                    confirmBillOnState(selectedBill._id);
                    this.setState({
                      selectedBill: {
                        ...this.state.selectedBill,
                        seller: reduce(
                          account,
                          (result, value, key) => {
                            result.push({
                              name: key,
                              value
                            });
                            return result;
                          },
                          []
                        )
                      }
                    });
                  }}
                />
              )
            )}
          </div>
        </div>
        {/* <div className="row mt-3">
          <div className="col-md-12">
            <div className="card">
              <div className="header">
                <h3>SEARCHING FOR BILL</h3>
              </div>
              <div className="content">
                <form
                  id="filter-box"
                  onSubmit={e => {
                    e.preventDefault();
                    const { buyer, buyerInfoKey, status } = this;
                    const { begin, end } = this.state;
                    const obj = {
                      [buyerInfoKey.value]:
                        buyer.value !== "" ? buyer.value : undefined,
                      status: status.value !== "all" ? status.value : undefined,
                      begin:
                        begin !== "" && begin !== null
                          ? begin.toDate()
                          : undefined,
                      end: end !== "" && end !== null ? end.toDate() : undefined
                    };
                    history.push({
                      pathname: "/main/bill/list",
                      search: parseToQueryString(obj)
                    });
                  }}
                >
                  <div className="row">
                    <div className="col-md-10" style={{ display: "flex" }}>
                      <div className="form-group" style={{ flex: 2 }}>
                        <label>Buyer</label>
                        <input
                          ref={ref => (this.buyer = ref)}
                          name="buyer"
                          type="text"
                          placeholder="Search for buyer"
                          className="form-control border-input"
                        />
                      </div>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label style={{ color: "white" }}>User info</label>
                        <select
                          className="form-control border-input"
                          ref={ref => (this.buyerInfoKey = ref)}
                        >
                          <option defaultValue value="accountId">
                            By User ID
                          </option>
                          <option value="fullName">By name</option>
                          <option value="email">By email</option>
                          <option value="phoneNumber">By phone number</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>Status</label>
                        <select
                          className="form-control border-input"
                          ref={ref => (this.status = ref)}
                        >
                          <option defaultValue value="all">
                            All
                          </option>
                          <option value="pending">Pending</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Start date</label>
                        <DatePicker
                          selected={this.state.begin}
                          onChange={date => this.setState({ begin: date })}
                          className="form-control border-input"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>End date</label>
                        <DatePicker
                          selected={this.state.end}
                          onChange={date => this.setState({ end: date })}
                          className="form-control border-input"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <button
                      className="btn btn-info btn-fill btn-wd"
                      type="submit"
                    >
                      SEARCH
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div style={{ overflowY: "auto", height: 500, marginTop: 20 }}>
              {search.err !== null && (
                <div
                  className="alert alert-danger clickable d-flex justify-content-center"
                  role="alert"
                  onClick={() =>
                    searchForBills(location.search, "search", token)
                  }
                >
                  COULD NOT LOAD DATA. CLICK TO TRY AGAIN
                </div>
              )}
              {search.isLoading ? (
                <div className="text-center">
                  <Loader />
                </div>
              ) : search.data.length > 0 ? (
                <div className="list-group mt-3">
                  {search.data.map(bill => (
                    <Bill key={"search-bill-" + bill._id} bill={bill} />
                  ))}
                </div>
              ) : (
                search.err === null && (
                  <div className="text-center">
                    <p style={{ color: "gray" }}>NO BILL FOUND</p>
                  </div>
                )
              )}
            </div>
          </div>
        </div> */}
      </div>
    );
  }
}
const mapStateToProps = (state, props) => {
  const { token, role, account } = state.user;
  const { upcoming, search, completed } = state.bill;
  const { search: locationSearchUrl } = props.location;
  const { selected_bill_id } =
    locationSearchUrl !== "" ? parseToObject(locationSearchUrl) : {};

  return {
    billId: selected_bill_id ? selected_bill_id : null,
    token,
    upcoming,
    search,
    completed,
    role,
    account
  };
};
const mapDispatchToProps = dispatch => ({
  searchForBills: (query, billType, token) =>
    dispatch(searchForBills(query, billType, token)),
  toast: (message, level) => dispatch(toast(message, level)),
  confirmBillOnState: billId => dispatch(confirmBillOnState(billId)),
  setBillAsRead: billId => dispatch(setBillAsRead(billId))
});

export default connect(mapStateToProps, mapDispatchToProps)(BillList);
