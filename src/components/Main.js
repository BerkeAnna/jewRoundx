import React, { Component } from 'react';

class Main extends Component {

  render() {
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
          const miningLocation = this.miningLocation.value
          const miningYear = this.miningYear.value
          const extractionMethod = this.extractionMethod.value
          const purchased = this.purchased.value
          this.props.gemMining(gemType, weight, height, width, price, miningLocation, miningYear, 0, extractionMethod, purchased)
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
          <div className="form-group mr-sm-2">
            <input
              id="purchased"
              type="text"
              ref={(input) => { this.purchased = input }}
              className="form-control"
              placeholder="purchased"
              required />
          </div>

          <button type="submit" className="btn btn-primary">Add Product</button>
        </form>
        <p>&nbsp;</p>
        <h2>Buy Product</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Price</th>
              <th scope="col">Owner</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody id="productList">
            <tr>
              <th scope="row">1</th>
              <td>iPhone x</td>
              <td>1 Eth</td>
              <td>0x39C7BC5496f4eaaa1fF75d88E079C22f0519E7b9</td>
              <td><button className="buyButton">Buy</button></td>
            </tr>
            <tr>
              <th scope="row">2</th>
              <td>Macbook Pro</td>
              <td>3 eth</td>
              <td>0x39C7BC5496f4eaaa1fF75d88E079C22f0519E7b9</td>
              <td><button className="buyButton">Buy</button></td>
            </tr>
            <tr>
              <th scope="row">3</th>
              <td>Airpods</td>
              <td>0.5 eth</td>
              <td>0x39C7BC5496f4eaaa1fF75d88E079C22f0519E7b9</td>
              <td><button className="buyButton">Buy</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default Main;
