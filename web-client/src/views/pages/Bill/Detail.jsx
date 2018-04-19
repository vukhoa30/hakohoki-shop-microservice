import React, { Component } from "react";
import { connect } from "react-redux";
import { selectBill, confirmBill, toast } from "../../../api";
import { formatTime, currencyFormat } from "../../../utils";
import Loader from "../../components/Loader";
class BillDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstLoad: true,
      confirming: false
    };
  }
  getInfoName(infoKey) {
    switch (infoKey) {
      case "accountId":
        return "User Id";
      case "fullName":
        return "Name";
      case "email":
        return "Email";
      case "role":
        return "Role";
      default:
        return "Phone number";
    }
  }
  loadData(props) {
    const { selectBill, selectedBill, token, match } = props;
    const { params } = match;
    if (selectBill._id === params.id) return;
    selectBill({ _id: params.id }, token);
  }
  componentDidMount() {
    if (this.state.firstLoad) {
      this.setState({ firstLoad: false });
      this.loadData(this.props);
    }
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.location.search !== nextProps.location.search)
      this.loadData(nextProps);
  }
  render() {
    const { selectedBill, selectBill, token, toast } = this.props;
    return (
      <div className="container-fluid">
        <div className="d-flex flex-row">
          <h1>BILL DATA</h1>
          {selectedBill.isLoading && <Loader style={{ marginLeft: 30 }} />}
        </div>
        {!selectedBill.isLoading && (
          <div
            className="container p-5"
            style={{ height: 700, overflowY: "auto" }}
          >
            {selectedBill.status === "pending" && (
              <div
                className="d-flex flex-row-reverse"
                style={{ width: "100%" }}
              >
                <button
                  className="btn btn-info mb-3"
                  disabled={this.state.confirming}
                  onClick={async () => {
                    this.setState({ confirming: true });
                    const result = await confirmBill(selectedBill._id, token);
                    if (result.ok) {
                      toast("BILL CONFIRMED", "success");
                      selectBill({ _id: selectedBill._id }, token);
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
                  {this.state.confirming ? (
                    <i className="fa fa-spinner fa-spin" />
                  ) : (
                    "CONFIRM"
                  )}
                </button>
              </div>
            )}
            <div className="d-flex w-100 justify-content-between">
              <h3>User information</h3>
              <p className="float-right" style={{ color: "gray" }}>
                {formatTime(selectedBill.createdAt)}
              </p>
            </div>
            <div className="mt-3 card">
              <div className="card-body">
                {Object.keys(selectedBill.buyer).map((infoKey, index) => (
                  <div key={"user-info" + index} className="form-group row">
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
                ))}
              </div>
            </div>
            {selectedBill.seller && (
              <div className="mt-3">
                <div className="d-flex w-100 justify-content-between">
                  <h3>Seller information</h3>
                  <p className="float-right" style={{ color: "gray" }}>
                    confirmed at: {formatTime(selectedBill.completedAt)}
                  </p>
                </div>
                <div className="mt-3 card">
                  <div className="card-body">
                    {Object.keys(selectedBill.seller).map((infoKey, index) => (
                      <div key={"user-info" + index} className="form-group row">
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
                            defaultValue={selectedBill.seller[infoKey]}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
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
                {selectedBill.specificProducts.map(specificProduct => (
                  <tr key={"specific-product-" + specificProduct.id}>
                    <td>{specificProduct.id}</td>
                    <td>{specificProduct.productName}</td>
                    <td>{currencyFormat(specificProduct.price)}</td>
                  </tr>
                ))}
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
    );
  }
}
const mapStateToProps = state => ({
  selectedBill: state.bill.selected,
  token: state.user.token
});
const mapDispatchToProps = dispatch => ({
  selectBill: (bill, token) => dispatch(selectBill(bill, token)),
  toast: (message, level) => dispatch(toast(message, level))
});
export default connect(mapStateToProps, mapDispatchToProps)(BillDetail);
