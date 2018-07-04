import React, { Component } from "react";
import { connect } from "react-redux";
import { formatTime, currencyFormat } from "../../utils";
import { toast, confirmBill } from "../../api";
class BillDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirming: false
    };
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

  componentDidUpdate(prevProps) {
    if (
      this.props.selectedBill !== null &&
      (prevProps.selectedBill === null ||
        prevProps.selectedBill._id !== this.props.selectedBill._id)
    ) {
      this.dom.scrollTop = 0;
    }
  }

  render() {
    const {
      selectedBill,
      toast,
      token,
      role,
      confirmCompleted,
    } = this.props;
    const { confirming } = this.state;
    return (
      <div
        style={{ height: 700, overflowY: "auto", width: "100%" }}
        ref={ref => (this.dom = ref)}
      >
        <li className="row list-group-item">
          <div className="col-xs-3" style={{ backgroundColor: "transparent" }}>
            <img
              src={`assets/img/${
                selectedBill.status === "completed" ? "bill_complete" : "bill"
              }.png`}
              alt=""
              style={{ width: "100%", height: "auto" }}
            />
          </div>
          <div className="col-xs-6" style={{ backgroundColor: "transparent" }}>
            {/* {selectedBill.status === "pending" ? (
                      <p style={{ color: "orange" }}>PENDING</p>
                    ) : (
                      <p style={{ color: "green" }}>COMPLETED</p>
                    )} */}
            <h4 style={{ marginTop: 0 }}>ID: <b>{selectedBill._id}</b></h4>
            <div style={{ display: "flex" }}>
              <h5 style={{ fontWeight: "bold", marginTop: 0, flex: 1 }}>
                Total price: {currencyFormat(selectedBill.totalPrice)}
              </h5>
            </div>
            <div>
              <small style={{ color: "gray" }}>
                Ordered at: {formatTime(selectedBill.createdAt)}
              </small>
            </div>
            {selectedBill.completedAt && (
              <div>
                <small style={{ color: "gray" }}>
                  Confirmed at: {formatTime(selectedBill.completedAt)}
                </small>
              </div>
            )}
          </div>
          <div className="col-xs-3">
            {selectedBill.status === "pending" ? (
              (role === "receptionist" || role === "employee") && (
                <button
                  disabled={confirming}
                  className="btn btn-primary btn-block"
                  onClick={async () => {
                    this.setState({ confirming: true });
                    const result = await confirmBill(selectedBill._id, token);
                    if (result.ok) {
                      toast("BILL CONFIRMED", "success");
                      confirmCompleted();
                    } else {
                      const { status } = result;
                      switch (status) {
                        case 401:
                          toast("YOU ARE NOT AUTHORIZED", "error");
                          break;
                        case 0:
                          toast(
                            "CONNECTION ERROR! PLEASE CHECK YOUR CONNECTION",
                            "error"
                          );
                          break;
                        case 500:
                          toast(
                            "INTERNAL SERVER ERROR! TRY AGAIN LATER",
                            "error"
                          );
                          break;
                        default:
                          toast("UNDEFINED ERROR! TRY AGAIN LATER", "error");
                          break;
                      }
                    }
                    this.setState({ confirming: false });
                  }}
                >
                  {confirming ? (
                    <i className="fa fa-circle-o-notch fa-spin" />
                  ) : (
                    "CONFIRM"
                  )}
                </button>
              )
            ) : (
              <button className="btn btn-default" disabled={true}>
                <i className="fa fa-check" /> COMPLETED
              </button>
            )}
          </div>
        </li>
        <div style={{ marginTop: 20 }}>
          <h5>
            <b>USER INFORMATION</b>
          </h5>
          <table className="table table-striped">
            <thead style={{ backgroundColor: "#6f6666", color: "white" }}>
              <tr>
                <th>NAME</th>
                <th>DATA</th>
              </tr>
            </thead>
            <tbody>
              {selectedBill.buyer.map(
                buyer =>
                  buyer.name !== "role" && (
                    <tr key={"buyer-" + buyer.name}>
                      <td>{this.getInfoName(buyer.name)}</td>
                      <td>{buyer.value}</td>
                    </tr>
                  )
              )}
            </tbody>
          </table>
        </div>
        {selectedBill.seller && (
          <div style={{ marginTop: 20 }}>
            <h5>
              <b>SELLER INFORMATION</b>
            </h5>
            <table className="table table-striped">
              <thead style={{ backgroundColor: "#6f6666", color: "white" }}>
                <tr>
                  <th>NAME</th>
                  <th>DATA</th>
                </tr>
              </thead>
              <tbody>
                {selectedBill.seller.map(
                  seller =>
                    seller.name !== "role" && (
                      <tr key={"seller-" + seller.name}>
                        <td>{this.getInfoName(seller.name)}</td>
                        <td>{seller.value}</td>
                      </tr>
                    )
                )}
              </tbody>
            </table>
          </div>
        )}
        {selectedBill.products && (
          <div style={{ marginTop: 20 }}>
            <h5>
              <b>PRODUCTS</b>
            </h5>
            {selectedBill.products.map((product, index) => (
              <div
                className="row clickable"
                key={"product-" + index}
                style={{ marginBottom: 50 }}
              >
                <div className="col-xs-3">
                  <img
                    src={product.mainPicture}
                    alt=""
                    style={{ width: "100%", height: "auto" }}
                  />
                </div>
                <div className="col-xs-9">
                  <h4 style={{ marginTop: 0 }}>
                    <b>{product.productName}</b>
                    <p className="pull-right" style={{ color: "red" }}>
                      {currencyFormat(product.price)}
                    </p>
                  </h4>
                  <p>Quantity: {product.specifics.length}</p>
                  {product.giftProducts && (
                    <div className="panel panel-default">
                      <div className="panel-heading">
                        <b>
                          Attached products{" "}
                          {product.specifics.length > 1 &&
                            "x " + product.specifics.length}
                        </b>
                      </div>
                      <div className="panel panel-body">
                        {product.giftProducts.map((giftProduct, curIndex) => (
                          <div
                            className="row clickable"
                            key={"gift-product-" + curIndex}
                            style={{ marginBottom: 10 }}
                          >
                            <div className="col-xs-2">
                              <img
                                src={giftProduct.mainPicture}
                                alt=""
                                style={{
                                  width: "100%",
                                  height: "auto"
                                }}
                              />
                            </div>
                            <div className="col-xs-10">
                              <h4 style={{ marginTop: 0 }}>
                                <b>
                                  <small>{giftProduct.productName}</small>
                                </b>
                              </h4>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}
const mapStateToProps = (state, props) => {
  const { token, role } = state.user;

  return {
    token,
    role
  };
};
const mapDispatchToProps = dispatch => ({
  toast: (message, level) => dispatch(toast(message, level))
});
export default connect(mapStateToProps, mapDispatchToProps)(BillDetail);
