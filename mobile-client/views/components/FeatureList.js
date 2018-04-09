import React, { Component } from 'react';
import { View } from "react-native";
import { Icon, List, ListItem, Left, Body, Badge, Right } from "native-base";
import AppText from "./AppText"
class FeatureList extends Component {
    state = {}
    render() {
        const { list, onFeatureSelected, badge } = this.props
        return (
            <List dataArray={list}
                renderRow={(item) =>
                    <ListItem key={item.key} icon={item.icon !== undefined} onPress={() => onFeatureSelected(item.key)}>
                        {
                            item.icon ?
                                (<Left>
                                    <Icon name={item.icon} />
                                </Left>) : null
                        }
                        <Body>
                            <AppText>{item.name}</AppText>
                        </Body>
                        <Right>
                            {
                                badge > 0 &&
                                <Badge>
                                    <AppText>{badge}</AppText>
                                </Badge>
                            }
                        </Right>
                    </ListItem>
                }>
            </List>
        );
    }
}

export default FeatureList;