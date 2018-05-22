import React, { Component } from "react";
import { connect } from "react-redux";
import { View } from "react-native";
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
    this.state = {};
    const { accountId, token, loadOrders } = this.props;
    loadOrders(token, accountId);
  }

  render() {
    const { list, status } = this.props;
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
              dataArray={list.filter(order => order.status === 'pending')}
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
              dataArray={list.filter(order => order.status === 'completed')}
              renderRow={order => (
                <OrderShowcase key={"order-" + order._id} order={order} />
              )}
            />
          </Tab>
        </Tabs>
        {status === "LOADING" && (
          <View
            style={{
              width,
              height,
              position: "absolute",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Spinner />
          </View>
        )}
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

export default connect(mapStateToProps, mapDispatchToProps)(OrderList);
