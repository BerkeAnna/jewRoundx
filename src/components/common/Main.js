import React, { Component } from 'react';

class Main extends Component {

  render() {
    return (
      <div id="content">
       
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
