import React, { Component } from "react";
import { connect } from "react-redux";
import {
  formatTime,
  currencyFormat,
  parseToObject,
  parseToQueryString
} from "../../../utils";
import { searchForBills, getBill, toast } from "../../../api";
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import Bill from "../../components/Bill";
import $ from "jquery";
import { findDOMNode } from "react-dom";

class BillList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstLoad: true,
      begin: null,
      end: moment(),
      selectedBill: null,
      searchingForBill: false
    };
    const { token, searchForBills } = props;
    searchForBills("?status=pending", "pending", token);
    searchForBills("?status=completed", "completed", token);
  }

  componentDidMount() {
    if (this.state.firstLoad) {
      this.setState({ firstLoad: false });
      const { location, searchForBills, token } = this.props;
      const { search } = location;
      if (search === "") return;
      searchForBills(search, token);
      const searchObj = parseToObject(search);
      Object.keys(searchObj).map(key => {
        if (
          key === "accountId" ||
          key === "phoneNumber" ||
          key === "email" ||
          key === "fullName"
        ) {
          this.buyerInfoKey.value = key;
          this.buyer.value = searchObj[key];
        } else if (key === "status") this.status.value = searchObj[key];
        else if (key === "begin" || key === "end") {
          this.setState({ [key]: moment(searchObj[key]) });
        }
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location !== nextProps.location) {
      const { token, location, searchForBills } = nextProps;
      const { search } = location;
      searchForBills(search, token);
    }
  }

  getInfoName(infoKey) {
    switch (infoKey) {
      case "accountId":
        return "User Id";
      case "fullName":
        return "Name";
      case "email":
        return "Email";
      default:
        return "Phone number";
    }
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
      toast
    } = this.props;
    const { selectedBill } = this.state;
    return (
      <div className="container-fluid">
        <button className="btn btn-success mb-3">
          <i className="fa fa-plus mr-3" />
          CREATE A BILL
        </button>
        <div>
          <button ref={ref => this.toggleModel = ref} style={{ visibility: 'hidden', position: 'absolute' }} data-target="#bill" data-toggle="modal" />
          {/* Button trigger modal */}
          <div
            className="modal fade"
            id="bill"
            tabIndex={-1}
            role="dialog"
            aria-labelledby="bill"
            aria-hidden="true"
            ref={ref => (this.modalDialog = ref)}
          >
            <div
              className="modal-dialog modal-dialog-centered"
              role="document"
              style={{ minWidth: "80%" }}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title" id="exampleModalLabel">
                    BILL DETAIL
                  </h1>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
                <div className="modal-body">
                  {selectedBill !== null && (
                    <div>
                      <div className="d-flex w-100 justify-content-between">
                        <h3>User information</h3>
                        <p className="float-right" style={{ color: "gray" }}>
                          {formatTime(selectedBill.createdAt)}
                        </p>
                      </div>
                      <div className="mt-3 card">
                        <div className="card-body">
                          {Object.keys(selectedBill.buyer).map(
                            (infoKey, index) => (
                              <div
                                key={"user-info" + index}
                                className="form-group row"
                              >
                                <label
                                  htmlFor="staticEmail"
                                  className="col-sm-4 col-form-label font-weight-bold"
                                >
                                  {this.getInfoName(infoKey)}
                                </label>
                                <div className="col-sm-6">
                                  <input
                                    type="text"
                                    readOnly
                                    className="form-control-plaintext"
                                    id="staticEmail"
                                    defaultValue={selectedBill.buyer[infoKey]}
                                  />
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                      <h3 className="mt-3">Products</h3>
                      <table className="table mt-3">
                        <thead className="thead-dark">
                          <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Name</th>
                            <th scope="col">Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedBill.specificProducts.map(
                            specificProduct => (
                              <tr
                                key={"specific-product-" + specificProduct.id}
                              >
                                <td>{specificProduct.id}</td>
                                <td>{specificProduct.productName}</td>
                                <td>{currencyFormat(specificProduct.price)}</td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                      <div className="d-flex flex-row-reverse">
                        <p className="mt-5 font-weight-bold">
                          TOTAL:{" "}
                          {currencyFormat(
                            selectedBill.specificProducts.reduce(
                              (total, product) => total + product.price,
                              0
                            )
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-dismiss="modal"
                  >
                    Close
                  </button>
                  <button type="button" className="btn btn-primary">
                    Check out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <form
          onSubmit={async e => {
            e.preventDefault();
            if (this.state.searchingForBill) return;
            this.setState({ searchingForBill: true });
            const result = await getBill(this.billId.value, token);
            if (result.ok) {
              this.setState({ selectedBill: result.data });
              this.toggleModel.click()
            } else {
              if (result.status === 401)
                toast(`YOU ARE NOT AUTHORIZED TO SEE BILL DATA`, "error");
              else toast(`INTERNAL SERVER ERROR OR BILL NOT EXISTED`, "error");
            }
            this.setState({ searchingForBill: false });
          }}
        >
          <div className="input-group mt-1">
            <input
              ref={ref => (this.billId = ref)}
              type="text"
              className="form-control"
              placeholder="Enter bill Id"
              required
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-secondary"
                type="submit"
                disabled={this.state.searchingForBill}
              >
                {this.state.searchingForBill ? (
                  <i className="fa fa-spinner fa-spin" />
                ) : (
                  <i className="fa fa-search" />
                )}
              </button>
            </div>
          </div>
        </form>

        <div className="row mt-3">
          <div
            className="col-md-6 col-xs-12"
            style={{ height: 500, overflowY: "auto" }}
          >
            <h3>UPCOMING</h3>
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
              <div className="d-flex justify-content-center mt-5">
                <i className="fa fa-spinner fa-spin fa-3x" />
              </div>
            ) : upcoming.data.length > 0 ? (
              <div className="list-group mt-3">
                {upcoming.data.map(bill => (
                  <Bill
                    dialogId="#bill"
                    key={"upcoming-bill-" + bill._id}
                    bill={bill}
                    select={bill => {
                      this.setState({ selectedBill: bill });
                    }}
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
          <div
            className="col-md-6 col-xs-12"
            style={{ height: 500, overflowY: "auto" }}
          >
            <h3>COMPLETED</h3>
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
              <div className="d-flex justify-content-center mt-5">
                <i className="fa fa-spinner fa-spin fa-3x" />
              </div>
            ) : completed.data.length > 0 ? (
              <div className="list-group mt-3">
                {completed.data.map(bill => (
                  <Bill
                    dialogId="#bill"
                    key={"upcoming-bill-" + bill._id}
                    bill={bill}
                    select={bill => {
                      this.setState({ selectedBill: bill });
                    }}
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
        </div>
        <div className="row mt-3">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">
                <b>Filter box</b>
              </div>
              <div className="card-body bg-light">
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
                    <div className="col-8">
                      <label>Buyer</label>
                      <div className="input-group mb-3">
                        <input
                          ref={ref => (this.buyer = ref)}
                          name="buyer"
                          type="text"
                          placeholder="Search for buyer"
                          className="form-control"
                        />
                        <div className="input-group-append">
                          <select
                            className="form-control"
                            ref={ref => (this.buyerInfoKey = ref)}
                          >
                            <option defaultValue value="accountId">
                              ID
                            </option>
                            <option value="email">Email</option>
                            <option value="phoneNumber">Phone number</option>
                            <option value="fullName">User name</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="form-group">
                        <label>Status</label>
                        <select
                          className="form-control"
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
                    <div className="col">
                      <div className="form-group">
                        <label>Start date</label>
                        <DatePicker
                          selected={this.state.begin}
                          onChange={date => this.setState({ begin: date })}
                          className="form-control"
                        />
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-group">
                        <label>End date</label>
                        <DatePicker
                          selected={this.state.end}
                          onChange={date => this.setState({ end: date })}
                          className="form-control"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="d-flex flex-row-reverse mt-3">
                    <button className="btn btn-secondary" type="submit">
                      Search
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
                  onClick={() => searchForBills(location.search, token)}
                >
                  COULD NOT LOAD DATA. CLICK TO TRY AGAIN
                </div>
              )}
              {search.isLoading ? (
                <div className="d-flex justify-content-center mt-5">
                  <i className="fa fa-spinner fa-spin fa-3x" />
                </div>
              ) : search.data.length > 0 ? (
                <div className="list-group mt-3">
                  {search.data.map(bill => (
                    <Bill
                      dialogId="#bill"
                      key={"search-bill-" + bill._id}
                      bill={bill}
                      select={bill => {
                        this.setState({ selectedBill: bill });
                        $("#bill").modal("show");
                      }}
                    />
                  ))}
                </div>
              ) : (
                search.err === null && (
                  <div className="d-flex justify-content-center mt-5">
                    <p style={{ color: "gray" }}>NO BILL FOUND</p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state, props) => {
  const { token } = state.user;
  const { upcoming, search, completed } = state.bill;

  return {
    token,
    upcoming,
    search,
    completed
  };
};
const mapDispatchToProps = dispatch => ({
  searchForBills: (query, billType, token) =>
    dispatch(searchForBills(query, billType, token)),
  toast: (message, level) => dispatch(toast(message, level))
});

export default connect(mapStateToProps, mapDispatchToProps)(BillList);
