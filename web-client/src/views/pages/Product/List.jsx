import React, { Component } from "react";
import { connect } from "react-redux";
import ProductShowcase from "../../components/ProductShowcase";
import { uniqWith } from "lodash";
import {
  loadProductList,
  fetchProductData,
  selectProduct,
  toast
} from "../../../api";
import { parseToQueryString, parseToObject } from "../../../utils";
import Loader from "../../components/Loader";

class ProductList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstLoad: true,
      searchingForProduct: false
    };
    const { loadProductList, location } = props;
    loadProductList(location.search, 0, 10);
  }
  async componentDidMount() {
    if (this.state.firstLoad) {
      const { search } = this.props.location;
      const searchObj = await parseToObject(search);
      this.setState({
        firstLoad: false,
        category: searchObj.category ? searchObj.category : "All"
      });
      if (searchObj.q) {
        this.q.value = searchObj.q;
      }
    }
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.isLoading !== nextProps.isLoading) {
      console.log(nextProps.isLoading);
      console.log(nextProps.data);
    }
    if (this.props.location !== nextProps.location) {
      const { loadProductList, location } = nextProps;
      loadProductList(location.search, 0, 10);
    }
  }
  render() {
    const {
      isLoading,
      err,
      history,
      data,
      loadProductList,
      location,
      selectProduct,
      toast,
      role
    } = this.props;
    const categories = [
      {
        name: "All",
        icon: "fa fa-list"
      },
      {
        name: "Phone",
        icon: "fa fa-phone"
      },
      {
        name: "Tablet",
        icon: "fa fa-tablet"
      },
      {
        name: "Accessory",
        icon: "fa fa-headphones"
      },
      {
        name: "SIM",
        icon: "fa fa-file-o"
      },
      {
        name: "Card",
        icon: "fa fa-credit-card-alt"
      }
    ];

    const list = uniqWith(data, (a, b) => a._id === b._id);

    return (
      <div className="container-fluid">
        {/* <form
          className="form-inline"
          style={{ marginTop: 10 }}
          onSubmit={async e => {
            e.preventDefault();
            if (this.state.searchingForProduct) return;
            this.setState({ searchingForProduct: true });
            const result = await fetchProductData(this.productId.value);
            if (result.ok) {
              selectProduct(result.data, "detail");
            } else {
              toast(`INTERNAL SERVER ERROR OR PRODUCT NOT EXISTED`, "error");
            }
            this.setState({ searchingForProduct: false });
          }}
        >
          <div className="form-group" style={{ width: "80%" }}>
            <input
              ref={ref => (this.productId = ref)}
              type="text"
              className="form-control border-input"
              placeholder="Enter product Id"
              style={{
                width: "100%",
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0
              }}
              required
            />
          </div>
          <button
            className="btn btn-default"
            type="submit"
            disabled={this.state.searchingForProduct}
            style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
          >
            {this.state.searchingForProduct ? (
              <i className="fa fa-circle-o-notch fa-spin" />
            ) : (
              <i className="fa fa-search" />
            )}
          </button>
          {role === "manager" && (
            <button
              className="btn btn-success"
              style={{ marginLeft: 20 }}
              onClick={() => history.push("/main/product/add-product")}
            >
              <i className="fa fa-plus" />
              Add product
            </button>
          )}
        </form> */}
        {(role === "manager" || role === "employee") && (
          <button
            className="btn btn-success"
            style={{ marginLeft: 20 }}
            onClick={() => history.push("/main/product/add-product")}
          >
            <i className="fa fa-plus" />
            Add product
          </button>
        )}
        <div className="card" style={{ padding: 10, marginTop: 10 }}>
          <div className="content">
            <form
              className="form-inline"
              style={{ marginBottom: 10 }}
              onSubmit={e => {
                e.preventDefault();
                history.push({
                  ...location,
                  search: parseToQueryString({
                    category:
                      this.state.category === "All"
                        ? undefined
                        : this.state.category,
                    q: this.q.value === "" ? undefined : this.q.value
                  })
                });
              }}
            >
              <div className="form-group" style={{ width: "90%" }}>
                <input
                  ref={ref => (this.q = ref)}
                  type="text"
                  className="form-control border-input"
                  placeholder="Search for product"
                  style={{
                    width: "100%",
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0
                  }}
                  required
                />
              </div>
              <button
                className="btn btn-default"
                type="submit"
                style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
              >
                <i className="fa fa-search" />
              </button>
            </form>
            <ul className="list-inline">
              {categories.map(category => (
                <li
                  key={"Category-" + category.name}
                  className="list-inline-item clickable"
                  style={{
                    marginRight: 20,
                    color:
                      category.name === this.state.category ? "blue" : "black"
                  }}
                  onClick={() => {
                    this.setState({ category: category.name });
                    history.push({
                      ...location,
                      search: parseToQueryString({
                        category:
                          category.name === "All" ? undefined : category.name
                      })
                    });
                  }}
                >
                  <i
                    className={category.icon}
                    style={{ fontSize: 20, marginRight: 10 }}
                  />
                  <small style={{ fontSize: 20 }}>{category.name}</small>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {list.length > 0 ? (
          <div className="row mt-5">
            {list.map((product, index) => (
              <div className="col-sm-4 col-lg-3" key={"product-" + product._id}>
                <ProductShowcase product={product} showButton nameReduce />
              </div>
            ))}
          </div>
        ) : (
          !isLoading && (
            <div className="text-center">
              <p style={{ color: "gray" }} className="mt-5">
                NO PRODUCT FOUND
              </p>
            </div>
          )
        )}
        <div className="row text-center">
          {err !== null && (
            <div
              className="alert alert-danger clickable"
              role="alert"
              onClick={e =>
                loadProductList(
                  "?" +
                    parseToQueryString({
                      category:
                        this.state.category === "All"
                          ? undefined
                          : this.state.category,
                      q: this.q.value === "" ? undefined : this.q.value
                    }),
                  list.length,
                  10
                )
              }
            >
              Could not load data from server. Click to load again!
            </div>
          )}
          {isLoading ? (
            <Loader />
          ) : (
            list.length > 0 &&
            err === null && (
              <button
                className="mt-5 btn btn-light"
                onClick={e =>
                  loadProductList(
                    "?" +
                      parseToQueryString({
                        category:
                          this.state.category === "All"
                            ? undefined
                            : this.state.category,
                        q: this.q.value === "" ? undefined : this.q.value
                      }),
                    list.length,
                    10
                  )
                }
              >
                LOAD MORE PRODUCT ...
              </button>
            )
          )}
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  ...state.product.list,
  role: state.user.role
});
const mapDispatchToProps = dispatch => ({
  loadProductList: (query, offset, limit) =>
    dispatch(loadProductList(query, offset, limit)),
  selectProduct: (productId, viewType) =>
    dispatch(selectProduct(productId, viewType)),
  toast: (message, level) => dispatch(toast(message, level))
});
export default connect(mapStateToProps, mapDispatchToProps)(ProductList);
