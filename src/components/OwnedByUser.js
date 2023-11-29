import React, { Component } from 'react';

class Main extends Component {
  render() {
    const { minedGems, account } = this.props;

    // Szűrjük a gemeket, hogy csak azokat jelenítsük meg, amelyeknek az owner-je megegyezik a felhasználói fiókkal
    const ownedGems = minedGems.filter((minedGem) => minedGem.owner === account);
    console.log(account)

    return (
      <div id="tables">
        <p>&nbsp;</p>
        <h2>List of mined gems</h2>
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
          <tbody>
            {ownedGems.map((minedGem, key) => {
              return (
               
                                        /* TODO: sign mined or processing */
                minedGem.purchased===false ? (
                  
                  <tr key={key}>
                    <th scope="row">{minedGem.id.toString()}</th>
                    <td>{minedGem.gemType}</td>
                    <td>{window.web3.utils.fromWei(minedGem.price.toString(), 'Ether')} Eth</td>
                    <td>{minedGem.owner}</td>
                    <td>
                      <button
                        name={minedGem.id}
                        value={minedGem.price}
                        onClick={(event) => {
                          this.props.purchaseGem(event.target.name, event.target.value);
                        }}
                      >
                        Process
                      </button>
                    </td>
                  </tr>
                ) : null
              );
            }
            )}
          </tbody>
        </table>
     
        <h2>List of processing gems</h2>
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
          <tbody>
            {ownedGems.map((minedGem, key) => {
              return (
              
                                        /* TODO: sign mined or processing */
                minedGem.purchased===true ? (
                  
                  <tr key={key}>
                    <th scope="row">{minedGem.id.toString()}</th>
                    <td>{minedGem.gemType}</td>
                    <td>{window.web3.utils.fromWei(minedGem.price.toString(), 'Ether')} Eth</td>
                    <td>{minedGem.owner}</td>
                    <td>
                      <button
                        name={minedGem.id}
                        value={minedGem.price}
                        onClick={(event) => {
                          this.props.purchaseGem(event.target.name, event.target.value);
                        }}
                      >
                        Selecting
                      </button>
                    </td>
                    <td>
                      <button
                        name={minedGem.id}
                        value={minedGem.price}
                        onClick={(event) => {
                          this.props.sellGem(event.target.name);
                        }}
                      >
                        Sell
                      </button>
                    </td>
                  </tr>
                ) : null
              );
            }
            )}
          </tbody>
        </table>
      </div>
      

      
    );
    
  }
}

export default Main;