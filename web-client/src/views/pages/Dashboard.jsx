import React, { Component } from "react";
import { connect } from "react-redux";
import { Pie } from "react-chartjs-2";
import { currencyFormat } from "../../utils";
import { loadStatistic } from "../../api";
import Loader from "../components/Loader";

const options = {
  maintainAspectRatio: false,
  responsive: true,
  legend: {
    position: "left",
    labels: {
      boxWidth: 10
    }
  }
};
class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        labels: ["Phone", "Tablet", "Accessory", "SIM", "Card"],
        datasets: [
          {
            data: [300, 50, 100, 200, 300],
            backgroundColor: ["red", "green", "yellow", "blue", "purple"]
          }
        ]
      }
    };
  }
  componentWillMount() {
    const data = {
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: ["red", "green", "yellow", "blue", "purple"]
        }
      ]
    };
    this.props.categories.forEach(category => {
      data.labels.push(category.name);
      data.datasets[0].data.push(category.soldCount);
    });
    this.setState({ data });
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.isLoading !== nextProps.isLoading && !nextProps.isLoading) {
      const data = {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: ["red", "green", "yellow", "blue", "purple"]
          }
        ]
      };
      nextProps.categories.forEach(category => {
        data.labels.push(category.name);
        data.datasets[0].data.push(category.soldCount);
      });
      this.setState({ data });
    }
  }
  render() {
    const {
      isLoading,
      billCount,
      revenue,
      soldProductCount,
      err,
      loadStatistic,
      token
    } = this.props;
    return (
      <div className="container-fluid">
        {isLoading && (
          <div
            style={{
              width: "100%",
              paddingTop: 100,
              position: "absolute",
              zIndex: 100
            }}
            className="text-center"
          >
            <Loader />
          </div>
        )}
        {err !== null && (
          <div
            className="alert alert-danger clickable"
            onClick={() => loadStatistic(token)}
          >
            FAILED TO LOAD DATA! REFRESH PAGE TO TRY AGAIN
          </div>
        )}
        <div className="row" style={{ opacity: isLoading ? 0.5 : 1 }}>
          <div className="col-md-6 col-sm-6">
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
                      <p>Bills</p>
                      {billCount} bills
                    </div>
                  </div>
                </div>
                {/* <div className="footer">
                  <hr />
                  <div className="stats">
                    <i className="ti-reload" /> Updated now
                  </div>
                </div> */}
              </div>
            </div>
            <div className="card">
              <div className="content">
                <div className="row">
                  <div className="col-xs-5">
                    <div className="icon-big icon-success text-center">
                      <i className="ti-wallet" style={{ fontSize: 30 }} />
                    </div>
                  </div>
                  <div className="col-xs-7">
                    <div className="numbers">
                      <p>Revenue</p>
                      {currencyFormat(revenue)}
                    </div>
                  </div>
                </div>
                {/* <div className="footer">
                  <hr />
                  <div className="stats">
                    <i className="ti-calendar" /> Last day
                  </div>
                </div> */}
              </div>
            </div>
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
                      <p>Sold products</p>
                      {soldProductCount} products
                    </div>
                  </div>
                </div>
                {/* <div className="footer">
                  <hr />
                  <div className="stats">
                    <i className="ti-timer" /> In the last hour
                  </div>
                </div> */}
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card">
              <div className="header">
                <h4 className="title">STATISTIC</h4>
              </div>
              <div className="content">
                {!isLoading &&
                  err === null && (
                    <div id="piechart" className="ct-chart ct-perfect-fourth">
                      <Pie
                        data={this.state.data}
                        width={500}
                        options={options}
                      />
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
        {/* <div className="row">
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
        </div> */}
      </div>
    );
  }
}
const mapStateToProps = state => ({
  ...state.statistic,
  token: state.user.token
});
const mapDispatchToProps = dispatch => ({
  loadStatistic: token => dispatch(loadStatistic(token))
});
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
