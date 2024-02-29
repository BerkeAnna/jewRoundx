import React, { Component } from 'react';

import { useParams } from 'react-router-dom';

function withParams(Component) {
  return props => <Component {...props} params={useParams()} />;
}

class GemSelectingForm extends Component {

  render() {

    const { id } = this.props.params; // Az URL-ből származó ID
    const minedGemId = id; 

    return (
      <div id="content">
        <h1>Add Product</h1>
        <form onSubmit={(event) => {
          event.preventDefault()
          const gemType = this.gemType.value
          const price = window.web3.utils.toWei(this.price.value.toString(), 'Ether')
          const weight = this.weight.value
          const height = this.height.value
          const width = this.width.value
          const diameter = this.diameter.value
          const carat = this.carat.value
          const color = this.color.value
          const grinding = this.grinding.value
          console.log(minedGemId)
         // const minedGemId = 1
          this.props.gemSelecting(minedGemId, weight, height, width, diameter, carat, color, gemType, grinding, price)
        }}>
          <div className="form-group mr-sm-2">
            <input
              id="weight"
              type="text"
              ref={(input) => { this.weight = input }}
              className="form-control"
              placeholder="weight"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="height"
              type="text"
              ref={(input) => { this.height = input }}
              className="form-control"
              placeholder="height"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="width"
              type="text"
              ref={(input) => { this.width = input }}
              className="form-control"
              placeholder="width"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="diameter"
              type="text"
              ref={(input) => { this.diameter = input }}
              className="form-control"
              placeholder="diameter"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="carat"
              type="text"
              ref={(input) => { this.carat = input }}
              className="form-control"
              placeholder="carat"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="color"
              type="text"
              ref={(input) => { this.color = input }}
              className="form-control"
              placeholder="color"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="gemType"
              type="text"
              ref={(input) => { this.gemType = input }}
              className="form-control"
              placeholder="gemType"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="grinding"
              type="text"
              ref={(input) => { this.grinding = input }}
              className="form-control"
              placeholder="grinding"
              required />
          </div>
       
          <div className="form-group mr-sm-2">
            <input
              id="price"
              type="text"
              ref={(input) => { this.price = input }}
              className="form-control"
              placeholder="price"
              required />
          </div>
       

          <button type="submit" className="btn btn-primary">Add Product</button>
        </form>
       
      </div>
    );
  }
}

export default withParams(GemSelectingForm);