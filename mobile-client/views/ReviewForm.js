import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import { View, Alert } from 'react-native'
import { logOut, sendReview, loadProductFeedback } from '../presenters'
import { Container, Content, Button, Form, Spinner, Item, Input } from 'native-base'
import AppText from './components/AppText'
import StarRating from 'react-native-star-rating'
import { NavigationActions } from "react-navigation"

class ReviewForm extends Component {

    constructor(props) {
        super(props)
        this.state = {
            starCount: 0,
            status: 'PLEASE VOTING'
        }


    }

    componentDidUpdate() {

        const { submitSucceeded, submitFailed, error, clearSubmitErrors, navigation, loadProductFeedback, productID } = this.props

        if (submitSucceeded) {

            navigation.goBack()
            loadProductFeedback(productID)

        } else if (submitFailed && error) {

            Alert.alert('Error', error)
            clearSubmitErrors()
        }

    }
    renderInput({ input, placeholder, type, meta: { touched, error, warning } }) {
        let hasError = false;
        if (error !== undefined) {
            hasError = true
        }

        return (
            <Item error={hasError}>
                <Input {...input} placeholder={placeholder} style={{ fontSize: 12 }} multiline={true} numberOfLines={15} last />
            </Item>)
    }

    onStarRatingPress(rating) {

        let status = ''

        switch (rating) {
            case 1:
                status = 'BAD'
                break
            case 2:
                status = 'NOT GOOD'
                break
            case 3:
                status = 'GOOD'
                break
            case 4:
                status = 'VERY GOOD'
                break
            case 5:
                status = 'EXCELLENT'
                break
        }

        this.setState({
            starCount: rating,
            status
        });
    }

    render() {
        const { error, invalid, submitting, handleSubmit, navigation, productID } = this.props
        return (
            <Container>
                <Content style={{ paddingHorizontal: 20, paddingTop: 50 }}>
                    <Form>
                        <StarRating
                            disabled={false}
                            maxStars={5}
                            fullStarColor='orange'
                            emptyStarColor='orange'
                            rating={this.state.starCount}
                            selectedStar={(rating) => this.onStarRatingPress(rating)}
                        />
                        <AppText center style={{ marginTop: 20 }}>{this.state.status}</AppText>
                        <Field name='review' placeholder='TYPE YOUR REVIEW HERE' component={this.renderInput} />
                    </Form>
                    <Button block success disabled={this.state.starCount === 0} style={{ marginVertical: 10, marginTop: 50 }}
                        onPress={handleSubmit(sendReview.bind(this))}
                    >
                        {submitting ? <Spinner /> : null}
                        <AppText>SUBMIT</AppText>
                    </Button>
                    <Button block onPress={() => navigation.goBack()} >
                        <AppText>CLOSE</AppText>
                    </Button>
                </Content>
            </Container>
        )
    }

}

const mapStateToProps = (state) => ({

    productID: state.product.current.id,
    token: state.user.token

})

const mapDispatchToProps = (dispatch) => ({

    logOut: () => dispatch(logOut()),
    loadProductFeedback: productID => dispatch(loadProductFeedback(productID))

})

const ReduxForm = reduxForm({
    form: 'review_form',
    touchOnBlur: false,
    enableReinitialize: true,
    onSubmitFail: () => { },
    validate: values => {
        const errors = {}

        return errors
    },
})(ReviewForm)

export default connect(mapStateToProps, mapDispatchToProps)(ReduxForm)