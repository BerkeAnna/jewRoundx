import React, { Component } from 'react';

function GemDetails({ minedGems, account }) {

  
  const ownedMinedGems = minedGems.filter(minedGem => minedGem.owner === account);

  const renderMinedGems = () => {
    return ownedMinedGems.map((minedGem, key) => (
      //todo: id page
      minedGem.purchased === false && minedGem.selected === false &&(
        <tr key={key}>
          <th scope="row">{minedGem.id.toString()}</th>
          <td>{minedGem.gemType}</td>
          <td>{window.web3.utils.fromWei(minedGem.price.toString(), 'Ether')} Eth</td>
          <td>{minedGem.owner}</td>
          <td>
            <button
           
            >
              Process
            </button>
          </td>
        </tr>
      )
    ));
  };

/*todo:
    1. kilistazni az adott minedgemeket
    2. kilistazni az adott selectedgemeket
    3. kilistazni osszeparositva oket
*/
    return (
            <div className="pt-5">
              <h1>gemdetails</h1>
                  todo: - gemdetails

                  <div id="tables" className="pt-5">
                    <h2>List of mined gems</h2>
                    <table className="table">
                      <thead>{/* Table headers */}</thead>
                      <tbody>{renderMinedGems()}</tbody>
                    </table>
                  </div>
            </div>
    );
  }


export default GemDetails;