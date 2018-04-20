import React, { Component } from "react";
import { connect } from "react-redux";
class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-3 col-sm-6">
            <div className="card">
              <div className="content">
                <div className="row">
                  <div className="col-xs-5">
                    <div className="icon-big icon-warning text-center">
                      <i className="ti-server" />
                    </div>
                  </div>
                  <div className="col-xs-7">
                    <div className="numbers">
                      <p>Capacity</p>
                      105GB
                    </div>
                  </div>
                </div>
                <div className="footer">
                  <hr />
                  <div className="stats">
                    <i className="ti-reload" /> Updated now
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-sm-6">
            <div className="card">
              <div className="content">
                <div className="row">
                  <div className="col-xs-5">
                    <div className="icon-big icon-success text-center">
                      <i className="ti-wallet" />
                    </div>
                  </div>
                  <div className="col-xs-7">
                    <div className="numbers">
                      <p>Revenue</p>
                      $1,345
                    </div>
                  </div>
                </div>
                <div className="footer">
                  <hr />
                  <div className="stats">
                    <i className="ti-calendar" /> Last day
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-sm-6">
            <div className="card">
              <div className="content">
                <div className="row">
                  <div className="col-xs-5">
                    <div className="icon-big icon-danger text-center">
                      <i className="ti-pulse" />
                    </div>
                  </div>
                  <div className="col-xs-7">
                    <div className="numbers">
                      <p>Errors</p>
                      23
                    </div>
                  </div>
                </div>
                <div className="footer">
                  <hr />
                  <div className="stats">
                    <i className="ti-timer" /> In the last hour
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-sm-6">
            <div className="card">
              <div className="content">
                <div className="row">
                  <div className="col-xs-5">
                    <div className="icon-big icon-info text-center">
                      <i className="ti-twitter-alt" />
                    </div>
                  </div>
                  <div className="col-xs-7">
                    <div className="numbers">
                      <p>Followers</p>
                      +45
                    </div>
                  </div>
                </div>
                <div className="footer">
                  <hr />
                  <div className="stats">
                    <i className="ti-reload" /> Updated now
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="header">
                <h4 className="title">Users Behavior</h4>
                <p className="category">24 Hours performance</p>
              </div>
              <div className="content">
                <div id="chartHours" className="ct-chart" />
                <div className="footer">
                  <div className="chart-legend">
                    <i className="fa fa-circle text-info" /> Open
                    <i className="fa fa-circle text-danger" /> Click
                    <i className="fa fa-circle text-warning" /> Click Second
                    Time
                  </div>
                  <hr />
                  <div className="stats">
                    <i className="ti-reload" /> Updated 3 minutes ago
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="card">
              <div className="header">
                <h4 className="title">Email Statistics</h4>
                <p className="category">Last Campaign Performance</p>
              </div>
              <div className="content">
                <div
                  id="chartPreferences"
                  className="ct-chart ct-perfect-fourth"
                />
                <div className="footer">
                  <div className="chart-legend">
                    <i className="fa fa-circle text-info" /> Open
                    <i className="fa fa-circle text-danger" /> Bounce
                    <i className="fa fa-circle text-warning" /> Unsubscribe
                  </div>
                  <hr />
                  <div className="stats">
                    <i className="ti-timer" /> Campaign sent 2 days ago
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card ">
              <div className="header">
                <h4 className="title">2015 Sales</h4>
                <p className="category">All products including Taxes</p>
              </div>
              <div className="content">
                <div id="chartActivity" className="ct-chart" />
                <div className="footer">
                  <div className="chart-legend">
                    <i className="fa fa-circle text-info" /> Tesla Model S
                    <i className="fa fa-circle text-warning" /> BMW 5 Series
                  </div>
                  <hr />
                  <div className="stats">
                    <i className="ti-check" /> Data information certified
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({});
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
