import React, { Component } from "react";
import { connect } from "react-redux";
import { selectBill, confirmBill, toast } from "../../../api";
import { formatTime, currencyFormat } from "../../../utils";
import { transform } from "lodash";
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
    const { selectedBill, selectBill, token, toast, role } = this.props;
    const { specificProducts } = selectedBill;
    const products = transform(
      specificProducts,
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
            mainPicture: cur.mainPicture
          });
        }
        return result;
      },
      []
    );
    return (
      <div className="container-fluid">
        <div className="d-flex flex-row">
          <h1>BILL DATA</h1>
          {selectedBill.isLoading && <Loader style={{ marginLeft: 30 }} />}
        </div>
        {!selectedBill.isLoading && (
          <div className="container">
            <div className="row">
              <div className="col-xs-4">
                <img
                  src="assets/img/bill.png"
                  alt=""
                  style={{ width: "100%", height: "auto" }}
                />
                <h3>Status: <b style={{ color: selectBill.status === 'pending' ? 'orange' : 'green' }}>{selectedBill.status}</b></h3>
                {role === "receptionist" &&
                  selectedBill.status === "pending" && (
                    <div className="text-right" style={{ width: "100%" }}>
                      <button
                        className="btn btn-info mb-3"
                        disabled={this.state.confirming}
                        onClick={async () => {
                          this.setState({ confirming: true });
                          const result = await confirmBill(
                            selectedBill._id,
                            token
                          );
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
                                toast(
                                  "UNDEFINED ERROR! TRY AGAIN LATER",
                                  "error"
                                );
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
              </div>
              <div className="col-xs-8" style={{ borderLeft: '1px solid gray', height: 700, overflowY: "auto" }}>
                <div>
                  <div className="d-flex w-100 justify-content-between">
                    <h3>
                      User information
                      <small className="pull-right" style={{ color: "gray" }}>
                        order at {formatTime(selectedBill.createdAt)}
                      </small>
                    </h3>
                  </div>
                  <div className="mt-3 card">
                    <div className="content">
                      {Object.keys(selectedBill.buyer).map((infoKey, index) => (
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
                      ))}
                    </div>
                  </div>
                  {selectedBill.seller && (
                    <div className="mt-3">
                      <div className="d-flex w-100 justify-content-between">
                        <h3>Seller information</h3>
                        <p className="float-right" style={{ color: "gray" }}>
                          confirm at: {formatTime(selectedBill.completedAt)}
                        </p>
                      </div>
                      <div className="mt-3 card">
                        <div className="content">
                          {Object.keys(selectedBill.seller).map(
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
                                    defaultValue={selectedBill.seller[infoKey]}
                                  />
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  <h3 className="mt-3">Products</h3>
                  {products.map((product, index) => (
                    <div className="row" key={"product-" + index}>
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
                          <p className="pull-right">
                            {currencyFormat(product.price)}
                          </p>
                        </h4>
                        <p>Quantity: {product.specifics.length}</p>
                      </div>
                    </div>
                  ))}
                  <div
                    className="text-right"
                    style={{ marginTop: 10, width: "100%" }}
                  >
                    <b>
                      TOTAL:{" "}
                      {currencyFormat(
                        selectedBill.specificProducts.reduce(
                          (total, product) => total + product.price,
                          0
                        )
                      )}
                    </b>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
const mapStateToProps = state => ({
  selectedBill: state.bill.selected,
  token: state.user.token,
  role: state.user.role
});
const mapDispatchToProps = dispatch => ({
  selectBill: (bill, token) => dispatch(selectBill(bill, token)),
  toast: (message, level) => dispatch(toast(message, level))
});
export default connect(mapStateToProps, mapDispatchToProps)(BillDetail);
