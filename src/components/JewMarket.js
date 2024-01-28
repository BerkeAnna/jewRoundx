import React, { Component } from 'react';

class JewMarket extends Component {

  render() {
    //console.table(this.props.minedGems);

    return (
            <div id="tables">
                    <p>&nbsp;</p>
                    <h2>Jew market :P</h2>
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
                              {this.props.jewelry.map((jewelry, key) => {
                                return(
                                  jewelry.owner !== this.props.account ? (
                                            <tr key={key}>
                                              <th scope="row">{jewelry.id.toString()}</th>
                                              <td>{jewelry.name}</td>
                                             
                                              <td>{window.web3.utils.fromWei(jewelry.price.toString(), 'Ether')} Eth</td>
                                              <td>{jewelry.owner}</td>
                                              <td>
                                                <button
                                                  
                                                >
                                                  Buy
                                                </button>
                                              </td>
                                            </tr>
                                          ) : null //todo
                                    )
                              })}
                            
                            </tbody>
                        </table>
            </div>
    );
  }
}

export default JewMarket;