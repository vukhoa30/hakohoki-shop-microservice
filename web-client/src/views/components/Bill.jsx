import React, { Component } from "react";
import { connect } from "react-redux";
import { formatTime, currencyFormat } from "../../utils";
class Bill extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { bill, select, dialogId } = this.props;
    return (
      <li
        className="list-group-item list-group-item-action flex-column align-items-start pt-3 pb-5"
        onClick={() => this.setState({ selectedBill: bill })}
      >
        {bill.status === "pending" ? (
          <p style={{ color: "orange" }}>PENDING</p>
        ) : (
          <p style={{ color: "green" }}>COMPLETED</p>
        )}
        <div className="d-flex justify-content-between">
          <h5 className="mb-1 font-weight-bold">
            Total price: {currencyFormat(bill.totalPrice)}
          </h5>
          <small>{formatTime(bill.createdAt)}</small>
        </div>
        <p className="mb-1 mt-3">
          <b>Buyer:</b> {bill.buyer.fullName} (id: {bill.buyer.accountId})
        </p>
        <div className="d-flex flex-row-reverse">
          <a href="javascript:;" data-toggle="modal" data-target={dialogId} onClick={() => select(bill)}>
            View detail
          </a>
        </div>
      </li>
    );
  }
}
const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({});
export default connect(mapStateToProps, mapDispatchToProps)(Bill);
