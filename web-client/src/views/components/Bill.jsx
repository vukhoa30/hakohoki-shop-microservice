import React, { Component } from "react";
import { connect } from "react-redux";
import { formatTime, currencyFormat } from "../../utils";
import { Link } from "react-router-dom";
import IncomingIcon from "../components/Incoming";
class Bill extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  renderInformation(info) {
    let name = "";
    if (info.name === "role") return <div key={"info-" + info.name} />;
    switch (info.name) {
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
    return (
      <div key={"info-" + info.name} style={{ display: "flex" }}>
        <p style={{ flex: 1, fontWeight: "bold" }}>{name}</p>
        <p style={{ flex: 5 }}>{info.value}</p>
      </div>
    );
  }
  render() {
    const { bill, selectBill } = this.props;
    return (
      <li
        className="row list-group-item clickable bill-showcase"
        onClick={() => selectBill(bill)}
      >
        <div className="col-xs-3" style={{ backgroundColor: "transparent" }}>
          <img
            src={`assets/img/${
              bill.status === "completed" ? "bill_complete" : "bill"
            }.png`}
            alt=""
            style={{ width: "100%", height: "auto" }}
          />
        </div>
        <div className="col-xs-9" style={{ backgroundColor: "transparent" }}>
          {bill.status === "pending" ? (
            <p style={{ color: "orange" }}>
              PENDING
              {bill.new && (
                <div className="pull-right">
                  <IncomingIcon />
                </div>
              )}
            </p>
          ) : (
            <p style={{ color: "green" }}>COMPLETED</p>
          )}
          <div>
            <small style={{ color: "gray" }}>
              Ordered at: {formatTime(bill.createdAt)}
            </small>
          </div>
          {bill.completedAt && (
            <div>
              <small style={{ color: "gray" }}>
                Confirmed at: {formatTime(bill.completedAt)}
              </small>
            </div>
          )}
          <div style={{ display: "flex" }}>
            <h5 style={{ fontWeight: "bold", marginTop: 0, flex: 1 }}>
              Total price: {currencyFormat(bill.totalPrice)}
            </h5>
          </div>
          {/* <div className="panel panel-default" style={{ marginTop: 50 }}>
            <div className="panel-heading">
              <b>Buyer information</b>
            </div>
            <div className="panel-body">
              {bill.buyer.map(info => this.renderInformation(info))}
            </div>
          </div>
          {bill.status === "completed" && (
            <div className="panel panel-default">
              <div className="panel-heading">
                <b>Seller information</b>
              </div>
              <div className="panel-body">
                {bill.seller.map(info => this.renderInformation(info))}
              </div>
            </div>
          )} */}
        </div>
      </li>
    );
  }
}
const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({});
export default connect(mapStateToProps, mapDispatchToProps)(Bill);
