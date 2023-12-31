import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';

function OwnedByUser({ minedGems, selectedGems, account,  purchaseGem, sellGem }) {
 // render() {
   // const { minedGems, account } = this.props;
    const navigate = useNavigate();

    // Szűrjük a gemeket, hogy csak azokat jelenítsük meg, amelyeknek az owner-je megegyezik a felhasználói fiókkal
    const ownedGems = minedGems.filter((minedGem) => 
    minedGem.owner === account ///???
);
    console.log("fitrsitika" + ownedGems[0])

    const processingGems = selectedGems.filter((selectedGem) => 
    selectedGem.owner === account //????
);

console.log("fitrsitika" + processingGems[0])

    const pg = selectedGems.filter((selectedGem) => {
      const minedGem = minedGems.find((mg) => mg.id === selectedGem.minedGemId);
      return minedGem && minedGem.owner === account;
    });
  
    

    console.log(processingGems)

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
              <th scope="col">pp</th>
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
                          purchaseGem(event.target.name, event.target.value);
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
     
        <h2>List of selected gems</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Price</th>
              <th scope="col">Owner</th>
              <th scope="col">pp</th>
              <th scope="col"></th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {ownedGems.map((minedGem, key) => {
              return (
              
                                        /* TODO: sign mined or processing */
                minedGem.purchased===true  ? (
                  
                  <tr key={key}>
                    <th scope="row">{minedGem.id.toString()}</th>
                    <td>{minedGem.gemType}</td>
                    <td>{window.web3.utils.fromWei(minedGem.price.toString(), 'Ether')} Eth</td>
                    <td>{minedGem.owner}</td>
                    
                    <td>
                      
                   
                    <button onClick={() => navigate(`/gem-select/${minedGem.id}`)}>
                      Select Gem
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
          {processingGems.map((selectedGem, key) => {
            // Find the corresponding mined gem
            
            return (
              <tr key={key}>
                <th scope="row">{selectedGem.id.toString()}</th>
                <td>{selectedGem.gemType}</td>
                <td>{window.web3.utils.fromWei(selectedGem.price.toString(), 'Ether')} Eth</td>
                <td>{selectedGem.owner}</td>
                <td>
                  <button onClick={() => navigate(`/gem-select/${selectedGem.id}`)}>
                    Polishing
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
      

      
    );
    
  }
//}

export default OwnedByUser;