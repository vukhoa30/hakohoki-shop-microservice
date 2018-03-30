import React, { Component } from 'react';
import { Container, Content, Header, Body, Title } from "native-base";
import AppText from "./AppText"
class AppContainer extends Component {
    state = {}
    render() {
        return (
            <Container style={Object.assign({ backgroundColor: '#eee' }, this.props.style)}>
                {
                    this.props.includeHeader ?
                        <Header>
                            <Body>
                                <Title>{this.props.headerText}</Title>
                            </Body>
                        </Header> : null
                }
                <Content style={this.props.contentStyle}>
                    {this.props.children}
                </Content>
            </Container>
        );
    }
}

export default AppContainer;