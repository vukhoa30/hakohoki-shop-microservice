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
  renderInformation(info) {
    let name = "";
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
      <li className="row list-group-item clickable" onClick={() => selectBill(bill)}>
        <div className="col-xs-3">
          <img
            src={`assets/img/${
              bill.status === "completed" ? "bill_complete" : "bill"
            }.png`}
            alt=""
            style={{ width: "100%", height: "auto" }}
          />
          <div
            style={{
              marginTop: 10,
              width: "100%",
              display: "flex",
              justifyContent: "center"
            }}
          >
            {bill.status === "pending" ? (
              <p style={{ color: "orange" }}>PENDING</p>
            ) : (
              <p style={{ color: "green" }}>COMPLETED</p>
            )}
          </div>
        </div>
        <div className="col-xs-9">
          <div style={{ display: "flex" }}>
            <h5 style={{ fontWeight: "bold", marginTop: 0, flex: 1 }}>
              Total price: {currencyFormat(bill.totalPrice)}
            </h5>
          </div>
          <div className="panel panel-default">
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
                {bill.seller.map(
                  info =>
                    info.name === "role" ? (
                      <div />
                    ) : (
                      this.renderInformation(info)
                    )
                )}
              </div>
            </div>
          )}
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
