import React, { Component } from "react";
import { connect } from "react-redux";
import { View, RefreshControl } from "react-native";
import {
  Container,
  Content,
  Button,
  Tab,
  Tabs,
  List,
  ListItem,
  Spinner
} from "native-base";
import { loadOrders } from "../../api";
import { width, height } from "../../utils";
import AppText from "../components/AppText";
import OrderShowcase from "../components/OrderShowcase";

class OrderList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pending: [],
      completed: []
    };
    const { accountId, token, loadOrders } = this.props;
    loadOrders(token, accountId);
  }

  componentDidMount(){
    this.setData()
  }

  componentDidUpdate(prevProps){
    if (this.props.status === 'LOADED' && prevProps.status === 'LOADING')
      this.setData()
  }

  setData(){
    const { list } = this.props;
    this.setState({
      pending: list.filter(item => item.status === 'pending'),
      completed: list.filter(item => item.status === 'completed')
    })
  }

  render() {
    const { list, status, accountId, token, loadOrders } = this.props;
    const { pending, completed } = this.state
    return (
      <Container>
        <Tabs initialPage={0} style={{ backgroundColor: "transparent" }}>
          <Tab
            heading="ALL"
            tabStyle={{ backgroundColor: "#BE2E11" }}
            textStyle={{ color: "white" }}
            activeTabStyle={{ backgroundColor: "#BE2E11" }}
          >
            <List
              refreshControl={
                <RefreshControl
                  refreshing={status === "LOADING"}
                  onRefresh={() => loadOrders(token, accountId)}
                />
              }
              dataArray={list}
              renderRow={order => (
                <OrderShowcase key={"order-" + order._id} order={order} />
              )}
            />
          </Tab>
          <Tab
            heading="PENDING"
            tabStyle={{ backgroundColor: "#BE2E11" }}
            textStyle={{ color: "white" }}
            activeTabStyle={{ backgroundColor: "#BE2E11" }}
          >
            <List
              refreshControl={
                <RefreshControl
                  refreshing={status === "LOADING"}
                  onRefresh={() => loadOrders(token, accountId)}
                />
              }
              dataArray={pending}
              renderRow={order => (
                <OrderShowcase key={"order-" + order._id} order={order} />
              )}
            />
          </Tab>
          <Tab
            heading="COMPLETED"
            tabStyle={{ backgroundColor: "#BE2E11" }}
            textStyle={{ color: "white" }}
            activeTabStyle={{ backgroundColor: "#BE2E11" }}
          >
            <List
              refreshControl={
                <RefreshControl
                  refreshing={status === "LOADING"}
                  onRefresh={() => loadOrders(token, accountId)}
                />
              }
              dataArray={completed}
              renderRow={order => (
                <OrderShowcase key={"order-" + order._id} order={order} />
              )}
            />
          </Tab>
        </Tabs>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  ...state.order,
  accountId: state.user.account.accountId,
  token: state.user.token
});

const mapDispatchToProps = dispatch => ({
  loadOrders: (token, accountId) => dispatch(loadOrders(token, accountId))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderList);
