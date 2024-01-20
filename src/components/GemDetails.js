import React, { Component } from 'react';
import { useParams } from 'react-router-dom';

function GemDetails({ selectedGems, account,match  }) {

  const { gemId } = useParams(); // URL-ből az ID kinyerése
  //todo: selected gem, aminke az id-ja megegyezik az urlben lévővel.
  const gemDetails = selectedGems.filter(selectedGems => selectedGems.owner === account);
  console.log(gemId)
  const renderMinedGems = () => {
    
    console.log(gemId)
    return gemDetails.map((gem, key) => (
      //todo: id page
      gem.id == 1 &&(
        <tr key={key}>
          <th scope="row">{gem.id.toString()}</th>
          <td>{gem.gemType}</td>
          <td>{window.web3.utils.fromWei(gem.price.toString(), 'Ether')} Eth</td>
          <td>{gem.owner}</td>
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