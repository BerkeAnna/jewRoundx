import React, { Component } from 'react';
import { useParams } from 'react-router-dom';

function GemDetails({ selectedGems, account  }) {

  const { id } = useParams();
  const gemId = id;
  //todo: selected gem, aminke az id-ja megegyezik az urlben lévővel.
    const gemSelected = selectedGems.filter(selectedGems => selectedGems.owner === account);

  console.log(gemId)
  const renderMinedGems = () => {
    
    console.log(gemId)
    return gemSelected.map((gem, key) => (
      //todo: id page
      gem.id == gemId &&(
        <tr key={key}>
          <th scope="row">{gem.id.toString()}</th>
          <td>{gem.weight.toString()}</td>
          <td>{gem.height.toString()}</td>
          <td>{gem.width.toString()}</td>
          <td>{gem.diameter.toString()}</td>
          <td>{gem.carat.toString()}</td>
          <td>{gem.color}</td>
          <td>{gem.gemType}</td>
          <td>{gem.polishing.toString()}</td>
          <td>{window.web3.utils.fromWei(gem.price.toString(), 'Ether')} Eth</td>
          <td>{gem.owner}</td>
          
          
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

                  <h2>Data of mined gem</h2>
                  todo: minedgem datas

                  <div id="tables" className="pt-5">
                    <h2>Data of selected gem</h2>
                    <table className="table">
                      <thead>
                        <td>ID</td>
                        <td>Weight</td>
                        <td>Height</td>
                        <td>Width</td>
                        <td>Diameter</td>
                        <td>Carat</td>
                        <td>Color</td>
                        <td>Gemtype</td>
                        <td>Polishing</td>
                        <td>Price</td>
                        <td>Owner</td>
                      </thead>
                      <tbody>{renderMinedGems()}</tbody>
                    </table>
                  </div>
            </div>
    );
  }


export default GemDetails;