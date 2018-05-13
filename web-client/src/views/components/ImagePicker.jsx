import React, { Component } from "react";
import { connect } from "react-redux";
import { Modal } from "react-bootstrap";
import { toast } from "../../api";
class ImagePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDialog: false
    };
  }

  testImage(img, good, error) {
    const newImg = new Image();
    newImg.onload = good;
    newImg.onerror = error;
    newImg.src = img;
  }

  render() {
    const { instruction, image, changeImage, toast } = this.props;
    return (
      <div>
        <Modal show={this.state.showDialog}>
          <Modal.Header>
            <Modal.Title>CHOOSE IMAGE</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div class="form-group">
              <input
                placeholder="Enter image url"
                type="text"
                class="form-control border-input"
                id="pictureUrl"
                name="pictureUrl"
                ref={ref => (this.image = ref)}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button
              className="btn btn-primary"
              type="button"
              onClick={() => {
                const { value: image } = this.image;
                if (image === "") return;
                this.testImage(
                  image,
                  () => {
                    changeImage(image);
                    this.setState({ showDialog: false });
                  },
                  () => {
                    this.setState({ showDialog: false });
                    toast("INVALID IMAGE", "error");
                  }
                );
              }}
            >
              SELECT
            </button>
            <button
              type="button"
              className="btn btn-default"
              onClick={() => this.setState({ showDialog: false })}
            >
              CANCEL
            </button>
          </Modal.Footer>
        </Modal>
        {image && image !== null ? (
          <div>
            <img src={image} alt="" style={{ width: "100%", height: "auto" }} />
            <button
              type="button"
              className="btn btn-default btn-block"
              style={{ marginTop: 10 }}
              onClick={() => this.setState({ showDialog: true })}
            >
              Change image
            </button>
          </div>
        ) : (
          <div
            className="clickable"
            style={{
              width: "100%",
              height: 400,
              borderStyle: "dashed",
              borderColor: "gray",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            onClick={() => this.setState({ showDialog: true })}
          >
            <p style={{ color: "gray" }}>{instruction}</p>
          </div>
        )}
      </div>
    );
  }
}
const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({
  toast: (message, level) => dispatch(toast(message, level))
});
export default connect(mapStateToProps, mapDispatchToProps)(ImagePicker);
