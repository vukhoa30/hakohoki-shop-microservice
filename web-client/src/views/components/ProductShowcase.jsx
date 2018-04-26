import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { currencyFormat, reduceString } from "../../utils";
import { selectProduct } from "../../api";
class ProducShowcase extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  renderStars(starCount) {
    const stars = [];
    let i = 0;
    for (; i < starCount; i++)
      stars.push(
        <i
          key={"star-" + i}
          className="fa fa-star"
          style={{ color: "orange" }}
        />
      );
    for (; i < 5; i++)
      stars.push(
        <i
          key={"star-" + i}
          className="fa fa-star-o"
          style={{ color: "orange" }}
        />
      );
    return stars;
  }
  render() {
    const {
      autoHeight,
      showButton,
      product,
      selectProduct,
      nameReduce,
      history
    } = this.props;
    return (
      <div className="card clickable mb-3" style={{ width: "100%" }}>
        <img
          className="card-img-top"
          src={
            product.mainPicture
              ? product.mainPicture
              : "https://cdn.browshot.com/static/images/not-found.png"
          }
          alt="Product image"
          style={{ width: "100%", height: autoHeight ? "auto" : 300 }}
        />
        <div className="content">
          <h5 className="card-title">
            {nameReduce ? reduceString(product.name) : product.name}
          </h5>
          <p style={{ color: "red", fontSize: 20, marginBottom: 0 }}>
            {currencyFormat(
              product.promotionPrice ? product.promotionPrice : product.price
            )}
          </p>
          <small
            style={{
              textDecorationLine: "line-through",
              color: product.promotionPrice ? "gray" : "white"
            }}
          >
            {product.promotionPrice ? currencyFormat(product.price) : "None"}
          </small>
          {product.reviewScore ? (
            <div>
              {this.renderStars(product.reviewScore)}
              <small style={{ color: "gray" }}>({product.reviewCount})</small>
            </div>
          ) : (
            <small style={{ color: "gray", display: 'block' }}>No reviews</small>
          )}
          {showButton && (
            <div style={{ marginTop: 20 }}>
              <button
                className="btn btn-block btn-secondary"
                onClick={() => selectProduct(product)}
              >
                View details
              </button>
              <button
                className="btn btn-block btn-warning mt-3"
                onClick={() =>
                  history.push("/main/product/feedback/" + product._id)
                }
              >
                View feedback
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({
  selectProduct: product => dispatch(selectProduct(product))
});
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ProducShowcase)
);
