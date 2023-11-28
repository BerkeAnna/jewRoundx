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
              <th scope="col">gemType</th>
              <th scope="col">weight</th>
              <th scope="col">height</th>
              <th scope="col">width</th>
              <th scope="col">Price</th>
              <th scope="col">miningLocation</th>
              <th scope="col">miningYear</th>
              <th scope="col">pointOfProcessing</th>
              <th scope="col">extractionMethod</th>
              <th scope="col">owner</th>
              <th scope="col">purchased</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody id="productList">
            {this.props.minedGems.map((gem, key) => {
                return(
                  <tr key={key}>
                    <th scope="row">{gem.id.toString()}</th>
                    <td>{gem.gemType}</td>
                    <td>{gem.weight.toString()}</td>
                    <td>{gem.height.toString()}</td>
                    <td>{gem.width.toString()}</td>
                    <td>{window.web3.utils.fromWei(gem.price.toString(), 'Ether')}</td>

                    <td>{gem.miningLocation}</td>
                    <td>{gem.miningYear.toString()}</td>
                    <td>{gem.pointOfProcessing}</td>
                    <td>{gem.extractionMethod}</td>
                    <td>{gem.owner}</td>
                    <td>{gem.purchased}</td>
                    <td><button className="buyButton">Buy</button></td>
                  </tr>
                )
            })}
           
          
          </tbody>
        </table>
      </div>
    );
  }
}

export default Main;
