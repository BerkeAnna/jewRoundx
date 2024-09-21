import React, { Component } from 'react';

class MinedGemsList extends Component {

  render() {

    return (
            <div id="tables">
                    <p>&nbsp;</p>
                    <h2>List of mined gems</h2>
                        <table className="table">
                            <thead>
                                <tr>
                                <th scope="col">#</th>
                                <th scope="col">Name</th>
                                <th scope="col">Location</th>
                                <th scope="col">Method</th>
                                <th scope="col">Price</th>
                                <th scope="col">Owner</th>
                                <th scope="col">Process</th>
                                <th scope="col">*</th>
                                </tr>
                            </thead>
                            <tbody >
                              {this.props.minedGems.map((minedGem, key) => {
                                return(
                                        minedGem.purchased==0 && minedGem.owner!=this.props.account ? (
                                            <tr key={key}>
                                              <th scope="row">{minedGem.id.toString()}</th>
                                              <td>{minedGem.gemType}</td>
                                              <td>{minedGem.miningLocation}</td>
                                              <td>{minedGem.extractionMethod}</td>
                                              <td>{window.web3.utils.fromWei(minedGem.price.toString(), 'Ether')} Eth</td>
                                              <td>{minedGem.owner}</td>
                                              <td>{minedGem.pointOfProcessing }</td>
                                              <td>
                                                <button
                                                  name={minedGem.id}
                                                  value={minedGem.price}
                                                  onClick={(event) => {
                                                    this.props.purchaseGem(event.target.name, event.target.value);
                                                  }}
                                                >
                                                  Buy
                                                </button>
                                              </td>
                                            </tr>
                                          ) : null
                                    )
                              })}
                            
                            </tbody>
                        </table>
            </div>
    );
  }
}

export default MinedGemsList;