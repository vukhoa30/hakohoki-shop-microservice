import React, { Component } from "react";
import { connect } from "react-redux";
class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    
  }
  render() {
    return (
      <div>
        <p className="display-1" >DASHBOARD</p>
      </div>
    );
  }
}
const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({});
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
