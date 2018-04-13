import React, { Component } from "react";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import { View } from "react-native";
import {
  Container,
  Content,
  Button,
  Form,
  Spinner,
  Item,
  Input
} from "native-base";
import AppText from "../components/AppText";
import { SearchBar } from "react-native-elements";

class Search extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state
    const { search } = params ? params : {}
    
    return {
      headerTitle: (
        <SearchBar
          autoFocus={true}
          onSubmitEditing={text => search(text.nativeEvent.text)}
          containerStyle={{ width: "100%", backgroundColor: "transparent" }}
          inputStyle={{ backgroundColor: "white" }}
          lightTheme
          placeholder="Search for product"
        />
      )
    };
  };
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    this.props.navigation.setParams({ search: this.search.bind(this) });
  }

  async search(keyWords) {
    if (keyWords === "") return;
    this.props.navigation.navigate("Catalog", { q: keyWords, category: "All" });
  }

  render() {
    const { error, invalid, submitting, handleSubmit } = this.props;
    return <View />;
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Search);
