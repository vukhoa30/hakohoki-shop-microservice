import React, { Component } from "react";
import { Field, reduxForm, FieldArray } from "redux-form";
import { connect } from "react-redux";
import Input from "../../components/Input";
import { addProduct, toast, loadProductData } from "../../../api";
import { parseToObject, request } from "../../../utils";
import Loader from "../../components/Loader";
import { Modal } from "react-bootstrap";
import { reduce } from "lodash";

const renderSpecifications = ({ fields, meta: { error, submitFailed } }) => (
  <div className="card">
    <h3 className="header">Specifications</h3>
    <div className="content">
      {fields.map((specification, index) => (
        <div className="row mb-2" key={index}>
          <div className="col-xs-4">
            <Field
              name={`${specification}.name`}
              type="text"
              placeholder="Enter specification name"
              component={Input}
            />
          </div>
          <div className="col-xs-7">
            <Field
              name={`${specification}.value`}
              type="text"
              placeholder="Enter specification value"
              component={Input}
            />
          </div>
          <div className="col-xs-1">
            <i
              className="fa fa-remove text-danger"
              onClick={() => fields.remove(index)}
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        className="btn btn-light mt-3"
        onClick={() => fields.push({})}
      >
        <i className="fa fa-plus" /> Add specification
      </button>
    </div>
  </div>
);

class ProductDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mainPicture: this.props.initialValues.mainPicture,
      additionalPictures: this.props.initialValues.additionPicture,
      picturePickMode: "main",
      showPictureDialog: false,
      importing: false,
      importRequesting: false,
      currentProductId: null
    };
    const { initialValues: product, id } = props;
    if (id !== product._id) this.loadData();
  }

  loadData() {
    const { id, loadProductData } = this.props;
    loadProductData(id);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.initialValues._id !== nextProps.initialValues._id) {
      this.setState({
        mainPicture: nextProps.initialValues.mainPicture,
        additionalPictures: nextProps.initialValues.additionPicture
      });
    } else if (
      this.props.submitting !== nextProps.submitting &&
      !nextProps.submitting
    ) {
      const { toast, reset } = this.props;
      if (nextProps.submitFailed) toast(nextProps.error, "error");
      else {
        reset();
        toast("Add product successfully!", "success");
        this.setState({ mainPicture: null, additionalPictures: [] });
      }
    }
  }

  render() {
    const {
      history,
      handleSubmit,
      submitting,
      invalid,
      error,
      viewFeedback,
      initialValues,
      toast,
      isLoading,
      isError,
      id,
      token
    } = this.props;
    return (
      <div className="container-fluid">
        {isLoading && (
          <Loader
            style={{ zIndex: 100, position: "absolute", top: 100, left: "50%" }}
          />
        )}
        {isError && (
          <div
            class="alert alert-danger"
            role="alert"
            onClick={() => this.loadData()}
          >
            COULD NOT LOAD DATA. CLICK TO TRY AGAIN!
          </div>
        )}
        <Modal show={this.state.importing}>
          <form
            onSubmit={async e => {
              e.preventDefault();
              const amount = e.target.amount.value;
              if (amount === "" || amount < 0) return;
              this.setState({ importRequesting: true });
              let error = "Undefined error! Try again later";
              try {
                const { status, data } = await request(
                  "/products/specific",
                  "POST",
                  { Authorization: "JWT " + token },
                  {
                    productId: this.state.currentProductId,
                    amount
                  }
                );
                if (status === 200) {
                  toast("Import goods successfully!", "success");
                  return this.setState({
                    importRequesting: false,
                    importing: false
                  });
                } else if (status === 401) error = "You are not authorized!";
                else error = "Internal server error!";
              } catch (err) {
                if (err === "CONNECTION_ERROR") error = "Connection error!";
              }
              toast(error, "error");
              this.setState({ importRequesting: false });
            }}
          >
            <Modal.Header>
              <Modal.Title>IMPORT GOODS</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div class="form-group">
                <label for="email">Product quantity</label>
                <input
                  type="number"
                  class="form-control"
                  name="amount"
                  placeholder="Enter product quantity"
                />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <button type="submit" className="btn btn-primary">
                {this.state.importRequesting ? (
                  <i className="fa fa fa-circle-o-notch fa-spin"/>
                ) : (
                  "Import"
                )}{" "}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => this.setState({ importing: false })}
              >
                Cancel
              </button>
            </Modal.Footer>
          </form>
        </Modal>
        <Modal show={this.state.showPictureDialog}>
          <Modal.Header>
            <Modal.Title>Add product picture</Modal.Title>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">×</span>
            </button>
          </Modal.Header>
          <Modal.Body>
            <div className="form-group">
              <input
                className="form-control border-input"
                ref={ref => (this._mainPictureUri = ref)}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button
              type="button"
              className="btn btn-primary"
              data-dismiss="modal"
              onClick={() =>
                this.state.picturePickMode === "main"
                  ? this.setState({
                      mainPicture: this._mainPictureUri.value,
                      showPictureDialog: false
                    })
                  : this.setState({
                      additionalPictures: this.state.additionalPictures.concat(
                        this._mainPictureUri.value
                      ),
                      showPictureDialog: false
                    })
              }
            >
              Save changes
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() =>
                this.setState({
                  showPictureDialog: false
                })
              }
            >
              Close
            </button>
          </Modal.Footer>
        </Modal>
        <form
          onSubmit={handleSubmit(values => {
            const product = Object.assign({}, values, {
              mainPicture: this.state.mainPicture,
              additionPicture: this.state.additionalPictures,
              specifications: reduce(
                values.specifications,
                (result, current) => {
                  result[current.name] = current.value;
                  return result;
                },
                {}
              )
            });
            return addProduct(product, token).then(data =>
              this.setState({
                importing: true,
                currentProductId: data.id
              })
            );
          })}
        >
          <div style={{ opacity: isLoading ? 0.3 : 1 }}>
            {id && (
              <button
                type="button"
                className="btn btn-secondary mb-5"
                onClick={() => history.push("/main/product/detail/" + id)}
              >
                <i className="fa fa-caret-left mr-3" />
                Product detail
              </button>
            )}
            <div className="card">
              <h3 className="header">Basic information</h3>
              <div className="content">
                <div className="row">
                  <div className="col-md-5 col-xs-12">
                    {this.state.mainPicture !== null ? (
                      <div>
                        <img
                          src={this.state.mainPicture}
                          className="img-fluid"
                          style={{ width: "100%", height: "auto" }}
                          alt="Main picture"
                          onError={() => {
                            toast("INVALID PICTURE URI", "error");
                            this.setState({ mainPicture: null });
                          }}
                        />
                        <div>
                          <button
                            type="button"
                            className="btn btn-light mt-3"
                            onClick={() =>
                              this.setState({
                                picturePickMode: "main",
                                showPictureDialog: true
                              })
                            }
                          >
                            Change picture
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="jumbotron">
                          <p className="lead">
                            Main picture not available. Please select one!
                          </p>
                          <hr className="my-4" />
                          <p className="lead">
                            <button
                              type="button"
                              className="btn btn-primary btn-lg"
                              onClick={() =>
                                this.setState({
                                  picturePickMode: "main",
                                  showPictureDialog: true
                                })
                              }
                            >
                              Add picture
                            </button>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="col-md-7 col-xs-12">
                    <Field
                      name="name"
                      label="Product name"
                      type="text"
                      placeholder="Enter product name"
                      component={Input}
                    />
                    <div className="form-group">
                      <label>Category</label>
                      <Field
                        name="category"
                        component="select"
                        className="form-control border-input"
                      >
                        <option>Phone</option>
                        <option>Tablet</option>
                        <option>Accessory</option>
                        <option>SIM</option>
                        <option>Card</option>
                      </Field>
                    </div>
                    <div className="form-group">
                      <label>Guarantee</label>
                      <div className="row">
                        <div className="col-xs-3">
                          <Field
                            name="guarantee"
                            component="input"
                            className="form-control"
                            placeholde="Enter number of months for guarantee"
                            type="number"
                          />
                        </div>
                        <div className="col-xs-3">
                          <p style={{ fontSize: 20 }}>months</p>
                        </div>
                      </div>
                    </div>
                    <Field
                      name="price"
                      label="Price"
                      type="number"
                      placeholder="Enter price"
                      component={Input}
                    />
                    <Field
                      name="description"
                      label="Description"
                      type="textarea"
                      placeholder="Enter product name"
                      component={Input}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="card mt-5">
              <h3 className="header">Additional pictures</h3>
              <div className="content">
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() =>
                    this.setState({
                      picturePickMode: "addition",
                      showPictureDialog: true
                    })
                  }
                >
                  <i className="fa fa-plus" /> Add pictures
                </button>
                <div className="row">
                  {this.state.additionalPictures.map((pictureUri, index) => (
                    <div
                      key={"additionalPicture-" + index}
                      style={{
                        marginRight: 20,
                        width: 300,
                        display: "inline-block"
                      }}
                    >
                      <img
                        src={pictureUri}
                        alt="Additional image"
                        style={{ height: 300, width: "100%" }}
                        onError={() => {
                          const newArray = this.state.additionalPictures;
                          newArray.splice(index, 1);
                          this.setState({ additionalPictures: newArray });
                          toast("INVALID PICTURE URI", "error");
                        }}
                      />
                      <button
                        type="button"
                        style={{ marginTop: 10 }}
                        className="btn btn-danger btn-lg btn-block"
                        onClick={() => {
                          const newArray = this.state.additionalPictures;
                          newArray.splice(index, 1);
                          this.setState({ additionalPictures: newArray });
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <FieldArray
              name="specifications"
              component={renderSpecifications}
            />
            <div className="row">
              <div className="col" />
              <div className="col">
                {id ? (
                  <button
                    type="submit"
                    className="btn btn-success btn-block mt-5 btn-lg"
                    disabled={submitting || invalid || error}
                  >
                    {submitting && <Loader />}
                    Import goods
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="btn btn-primary btn-block mt-5 btn-lg"
                    disabled={submitting || invalid || error}
                  >
                    {submitting ? <Loader /> : "Add new product"}
                  </button>
                )}
              </div>
              <div className="col" />
            </div>
          </div>
        </form>
      </div>
    );
  }
}
const mapStateToProps = (state, props) => {
  const { match } = props;
  const { detail: product } = state.product;
  const { id } = match.params;
  const { token } = state.user;

  return {
    id,
    token,
    isLoading: product.isLoading,
    isError: product.err !== null,
    initialValues: !id
      ? {
          price: 0,
          guarantee: 6,
          category: "Phone",
          specifications: [],
          additionPicture: [],
          mainPicture: null
        }
      : { ...product, isLoading: undefined, err: undefined }
  };
};

const mapDispatchToProps = dispatch => ({
  toast: (message, level) => dispatch(toast(message, level)),
  loadProductData: productId => dispatch(loadProductData(productId))
});
const ReduxForm = reduxForm({
  form: "add_product_form",
  touchOnBlur: false,
  enableReinitialize: true,
  onSubmitFail: () => {},
  validate: values => {
    const errors = {};
    return errors;
  },
  shouldValidate: params => params.props.submitting
})(ProductDetail);

export default connect(mapStateToProps, mapDispatchToProps)(ReduxForm);
