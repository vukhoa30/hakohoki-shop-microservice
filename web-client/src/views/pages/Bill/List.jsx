import React, { Component } from "react";
import { connect } from "react-redux";
import {
  formatTime,
  currencyFormat,
  parseToObject,
  parseToQueryString
} from "../../../utils";
import {
  searchForBills,
  getBill,
  toast,
  confirmBill,
  selectBill
} from "../../../api";
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import Bill from "../../components/Bill";
import Loader from "../../components/Loader";
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
      searchingForBill: false,
      confirmingBill: false
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
      searchForBills(search, "search", token);
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
      searchForBills(search, "search", token);
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
      toast,
      selectBill
    } = this.props;
    const { selectedBill, confirmingBill } = this.state;
    return (
      <div className="container-fluid">
        <button className="btn btn-success mb-3">
          <i className="fa fa-plus mr-3" />
          CREATE A BILL
        </button>
        <form
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
          <div className="form-group" style={{ marginTop: 20 }}>
            <input
              ref={ref => (this.billId = ref)}
              type="text"
              className="form-control border-input"
              placeholder="Enter bill Id"
              required
            />
          </div>
        </form>

        <div className="row mt-3">
          <div
            className="col-md-6 col-xs-12"
            style={{ height: 600, overflowY: "auto" }}
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
                <Loader />
              </div>
            ) : upcoming.data.length > 0 ? (
              <div className="list-group mt-3">
                {upcoming.data.map(bill => (
                  <Bill key={"upcoming-bill-" + bill._id} bill={bill} />
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
            style={{ height: 600, overflowY: "auto" }}
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
                <Loader />
              </div>
            ) : completed.data.length > 0 ? (
              <div className="list-group mt-3">
                {completed.data.map(bill => (
                  <Bill key={"upcoming-bill-" + bill._id} bill={bill} />
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
              <div className="header">
                <h3>Filter box</h3>
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
                    <div className="col-md-8">
                      <div className="form-group">
                        <label>Buyer</label>
                        <input
                          ref={ref => (this.buyer = ref)}
                          name="buyer"
                          type="text"
                          placeholder="Search for buyer"
                          className="form-control border-input"
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
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
  toast: (message, level) => dispatch(toast(message, level)),
  selectBill: bill => dispatch(selectBill(bill))
});

export default connect(mapStateToProps, mapDispatchToProps)(BillList);
