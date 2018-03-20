import { connect } from 'react-redux'
import User from '../components/user'
import { actionType, getAction } from '../actions/userActions'

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn
    }
}

const mapDispatchToProps = dispatch => {
    return {
        authenticating: (email, password) => {
            dispatch(getAction(actionType.USER_AUTHENTICATING, { email, password }))
        }
    }
}

const UserContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(User)

export default UserContainer