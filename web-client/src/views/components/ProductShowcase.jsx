import React, { Component } from "react";
import { connect } from "react-redux";
class ProducShowcase extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  renderStars(starCount){
    
    const stars = [];
    let i = 0
    for (; i < starCount; i++)
        stars.push(<i class="fa fa-star" style={{ color: 'orange' }} />)
    for (; i < 5; i++)
        stars.push(<i class="fa fa-star-o" style={{ color: 'orange' }} />)
    return stars


  }
  render() {
    return (
      <div className="card" style={{ width: "100%" }}>
        <img className="card-img-top" src="https://support.apple.com/library/content/dam/edam/applecare/images/en_US/sfaq/sfaq-iphone_2x.png" alt="Product image" style={{ width: '100%', height: 300 }} />
        <div className="card-body">
          <h5 className="card-title">Samsung galaxy S7</h5>
          <p style={{ color: 'red', fontSize: 20, marginBottom: 0 }}>495.000 VND</p>
          <small style={{ textDecorationLine: 'line-through', color: 'gray' }} >500.000 VND</small>
          <div>
          {
              this.renderStars(3)
          }
          <small style={{ color: 'gray' }}>(12)</small>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({});
export default connect(mapStateToProps, mapDispatchToProps)(ProducShowcase);
