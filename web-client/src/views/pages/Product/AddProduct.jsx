import React, { Component } from "react";
import { Field, reduxForm, FieldArray } from "redux-form";
import { connect } from "react-redux";
import Input from "../../components/Input";
import { addProduct } from "../../../api";

const renderSpecifications = ({ fields, meta: { error, submitFailed } }) => (
  <div className="card mt-5">
    <h3 className="card-header">Specifications</h3>
    <div className="card-body">
      {fields.map((specification, index) => (
        <div className="row mb-2" key={index}>
          <div className="col-4">
            <Field
              name={`${specification}.name`}
              type="text"
              placeholder="Enter specification name"
              component={Input}
            />
          </div>
          <div className="col-7">
            <Field
              name={`${specification}.value`}
              type="text"
              placeholder="Enter specification value"
              component={Input}
            />
          </div>
          <div className="col-1">
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

class AddProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mainPicture: null,
      additionalPictures: [],
      picturePickMode: "main"
    };
  }
  render() {
    const { handleSubmit, submitting, invalid, error } = this.props;
    return (
      <div className="container-fluid">
        <form onSubmit={handleSubmit(addProduct.bind(this))}>
          <div
            className="modal fade"
            tabIndex={-1}
            role="dialog"
            id="mainPictureDialog"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add main product picture</h5>
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
                  <div className="form-group">
                    <input
                      className="form-control"
                      ref={ref => (this._mainPictureUri = ref)}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-primary"
                    data-dismiss="modal"
                    onClick={() =>
                      this.state.picturePickMode === "main"
                        ? this.setState({
                            mainPicture: this._mainPictureUri.value
                          })
                        : this.setState({
                            additionalPictures: this.state.additionalPictures.concat(
                              this._mainPictureUri.value
                            )
                          })
                    }
                  >
                    Save changes
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-dismiss="modal"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="card-header">Basic information</h3>
            <div className="card-body">
              <div className="row">
                <div className="col-md-5 col-xs-12">
                  {this.state.mainPicture !== null ? (
                    <div>
                      <img
                        src={this.state.mainPicture}
                        className="img-fluid"
                        alt="Main picture"
                        onError={() => {
                          alert("Picture uri not valid");
                          this.setState({ mainPicture: null });
                        }}
                      />
                      <button
                        type="button"
                        className="btn btn-light mt-3"
                        data-toggle="modal"
                        data-target="#mainPictureDialog"
                      >
                        Change picture
                      </button>
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
                            className="btn btn-primary btn-lg"
                            data-toggle="modal"
                            data-target="#mainPictureDialog"
                            onClick={() =>
                              this.setState({ picturePickMode: "main" })
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
                      className="form-control"
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
                    <Field
                      name="guarantee"
                      component="select"
                      className="form-control"
                    >
                      <option value="6">6 months</option>
                      <option value="12">12 months</option>
                    </Field>
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
            <h3 className="card-header">Additional pictures</h3>
            <div className="card-body">
              <button
                type="button"
                className="btn btn-light"
                data-toggle="modal"
                data-target="#mainPictureDialog"
                onClick={() => this.setState({ picturePickMode: "addition" })}
              >
                <i className="fa fa-plus" /> Add pictures
              </button>
              <div className="row">
                {this.state.additionalPictures.map((pictureUri, index) => (
                  <div
                    key={"additionalPicture-" + index}
                    style={{ marginRight: 20 }}
                  >
                    <img
                      src={pictureUri}
                      alt="Additional image"
                      style={{ height: 300, width: 300 }}
                    />
                    <button
                      type="button"
                      class="btn btn-danger btn-lg btn-block"
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
          <FieldArray name="specifications" component={renderSpecifications} />
          <div className="row">
            <div className="col" />
            <div className="col">
              <button
                type="submit"
                className="btn btn-primary btn-block mt-5 btn-lg"
                disabled={submitting || invalid || error}
              >
                {submitting && <i className="fa fa-spinner fa-spin" />}
                Add new product
              </button>
            </div>
            <div className="col" />
          </div>
        </form>
      </div>
    );
  }
}
const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({});
const ReduxForm = reduxForm({
  form: "add_product_form",
  touchOnBlur: false,
  enableReinitialize: true,
  onSubmitFail: () => {},
  initialValues: {
    price: 0,
    guarantee: 6,
    category: 'Phone'
  },
  validate: values => {
    const errors = {};
    return errors;
  },
  shouldValidate: params => params.props.submitting
})(AddProduct);

export default connect(mapStateToProps, mapDispatchToProps)(ReduxForm);
