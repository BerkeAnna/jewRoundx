import React, { Component } from 'react';

class GemMarket extends Component {

  render() {
    //console.table(this.props.minedGems);

    return (
            <div id="tables">
                    <p>&nbsp;</p>
                    <h2>Gem market :D</h2>
                        <table className="table">
                            <thead>
                                <tr>
                                <th scope="col">#</th>
                                <th scope="col">Name</th>
                                <th scope="col">Price</th>
                                <th scope="col">Owner</th>
                                <th scope="col">*</th>
                                </tr>
                            </thead>
                            <tbody >
                              {this.props.selectedGems.map((selectedGem, key) => {
                                return(
                                    selectedGem.used === false && (
                                            <tr key={key}>
                                              <th scope="row">{selectedGem.id.toString()}</th>
                                              <td>{selectedGem.gemType}</td>
                                             
                                              <td>{window.web3.utils.fromWei(selectedGem.price.toString(), 'Ether')} Eth</td>
                                              <td>{selectedGem.owner}</td>
                                              <td>
                                                <button
                                                  name={selectedGem.id}
                                                  value={selectedGem.price}
                                                  onClick={(event) => {
                                                    //todo: owner change
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

export default GemMarket;