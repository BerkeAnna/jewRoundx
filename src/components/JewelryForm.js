import React, { Component } from 'react';

class JewelryForm extends Component {

  render() {
    return (
      <div id="content">
        <h1>Add jewelry</h1>
        <form onSubmit={(event) => {
          event.preventDefault()
          const gemType = this.gemType.value
          const price = window.web3.utils.toWei(this.price.value.toString(), 'Ether')
          const weight = this.weight.value
          const height = this.height.value
          const width = this.width.value
          const miningLocation = this.miningLocation.value
          const miningYear = this.miningYear.value
          const extractionMethod = this.extractionMethod.value
          this.props.gemMining(gemType, weight, height, width, price, miningLocation, miningYear, extractionMethod, false);

         }}>
          <div className="form-group mr-sm-2">
            <input
              id="gemType"
              type="text"
              ref={(input) => { this.gemType = input }}
              className="form-control"
              placeholder="Type"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="price"
              type="text"
              ref={(input) => { this.price = input }}
              className="form-control"
              placeholder="Price"
              required />
          </div>
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
              id="miningLocation"
              type="text"
              ref={(input) => { this.miningLocation = input }}
              className="form-control"
              placeholder="miningLocation"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="miningYear"
              type="text"
              ref={(input) => { this.miningYear = input }}
              className="form-control"
              placeholder="miningYear"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="miningYear"
              type="text"
              ref={(input) => { this.miningYear = input }}
              className="form-control"
              placeholder="miningYear"
              required />
          </div>
       
          <div className="form-group mr-sm-2">
            <input
              id="extractionMethod"
              type="text"
              ref={(input) => { this.extractionMethod = input }}
              className="form-control"
              placeholder="extractionMethod"
              required />
          </div>
       

          <button type="submit" className="btn btn-primary">Add Product</button>
        </form>
       
      </div>
    );
  }
}

export default JewelryForm;
