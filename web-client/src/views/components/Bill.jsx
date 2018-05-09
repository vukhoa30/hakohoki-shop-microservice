import React, { Component } from "react";
import { connect } from "react-redux";
import { formatTime, currencyFormat } from "../../utils";
import { selectBill } from "../../api";
import { Link } from "react-router-dom";
class Bill extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { bill, selectBill } = this.props;
    return (
      <li className="row list-group-item list-group-item-action flex-column align-items-start pt-3 pb-5">
        <div className="col-xs-3">
          <img
            src="assets/img/bill.png"
            alt=""
            style={{ width: "100%", height: "auto" }}
          />
        </div>
        <div className="col-xs-9">
          {bill.status === "pending" ? (
            <p style={{ color: "orange" }}>PENDING</p>
          ) : (
            <p style={{ color: "green" }}>COMPLETED</p>
          )}
          <div style={{ display: "flex" }}>
            <h5 style={{ fontWeight: "bold", marginTop: 0, flex: 1 }}>
              Total price: {currencyFormat(bill.totalPrice)}
            </h5>
            <div className="text-right" style={{ flex: 1 }}>
              <small>created at: {formatTime(bill.createdAt)}</small>
              {bill.status === "completed" && (
                <small style={{ display: "block" }}>
                  confirmed at: {formatTime(bill.completedAt)}
                </small>
              )}
            </div>
          </div>
          <p className="mb-1 mt-3">
            <b>Buyer:</b> {bill.buyer.fullName} (<a href="javascript:;">
              {bill.buyer.accountId}
            </a>)
          </p>
          {bill.seller && (
            <p className="mb-1 mt-3">
              <b>Seller:</b> {bill.seller.fullName} (<a href="javascript:;">
                {bill.seller.accountId}
              </a>)
            </p>
          )}
          <div className="d-flex flex-row-reverse">
            <a href="javascript:;" onClick={() => selectBill(bill)}>
              View detail
            </a>
          </div>
        </div>
      </li>
    );
  }
}
const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({
  selectBill: bill => dispatch(selectBill(bill))
});
export default connect(mapStateToProps, mapDispatchToProps)(Bill);
