import React, { Component } from "react";
import { connect } from "react-redux";
import Detail from "../../components/ProductInformation";
import Feedback from "../../components/ProductFeedback";
import { Collapse } from "react-bootstrap";
import { parseToObject } from "../../../utils";

class ProductDetail extends Component {
  constructor(props) {
    super(props);
    const { hideDetailFirst } = props;
    this.state = {
      showDetail: !hideDetailFirst
    };
  }
  render() {
    return (
      <div>
        <a
          href="javascript:;"
          onClick={() => this.setState({ showDetail: !this.state.showDetail })}
        >
          <i
            className={
              this.state.showDetail ? "fa fa-caret-up" : "fa fa-caret-down"
            }
          />
          VIEW PRODUCT DETAIL
        </a>
        <Collapse in={this.state.showDetail}>
          <div>
            <Detail />
          </div>
        </Collapse>
        <div style={{ height: 800 }}>
          <Feedback />
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state, props) => {
  const { search } = props.location;
  const { selected } = parseToObject(search);
  return {
    hideDetailFirst: selected ? true : false
  };
};
const mapDispatchToProps = dispatch => ({});
export default connect(mapStateToProps, mapDispatchToProps)(ProductDetail);
