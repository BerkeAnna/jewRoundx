import React, { Component } from 'react';
import { useParams } from 'react-router-dom';


function GemDetails({ selectedGems, minedGems, account  }) {

  const { id } = useParams();
  const gemId = id;
  //todo: selected gem, aminke az id-ja megegyezik az urlben lévővel.
    const gemSelected = selectedGems.filter(selectedGems => selectedGems.owner === account);
    const minedGem = minedGems.filter(minedGems => minedGems.owner === account);

  const renderSelectedGems = () => {
    
    console.log(gemId)
    return gemSelected.map((gem, key) => (
      //todo: id page
      gem.id == gemId &&(
        <tr key={key}>
          <th scope="row">{gem.id.toString()}</th>
          <td>{gem.size.toString()}</td>
          <td>{gem.carat.toString()}</td>
          <td>{gem.color}</td>
          <td>{gem.gemType}</td>
          <td>{gem.polishing.toString()}</td>
          <td>{gem.used.toString()}</td>
          <td>{window.web3.utils.fromWei(gem.price.toString(), 'Ether')} Eth</td>
          <td>{gem.owner}</td>
          
          
        </tr>
      )
    ));
  };

  const renderMinedGems = () => {
    
    console.log(gemId)
    return minedGem.map((gem, key) => (
      //todo: id page
      gem.id == gemId &&(
        <tr key={key}>
          
          <th scope="row">{gem.id.toString()}</th>
          <td>{gem.gemType}</td>
          <td>{gem.weight.toString()}</td>
          <td>{gem.size.toString()}</td>
          <td>{gem.miningLocation}</td>
          <td>{gem.miningYear.toString()}</td>
          <td>{gem.extractionMethod}</td>
          <td>{gem.selected.toString()}</td>
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
                  todo: minedgem datas ending ---- in process
                  <table className="table">
                      <thead>
                        <td>ID</td>
                        <td>Type</td>
                        <td>Weight</td>
                        <td>Height</td>
                        <td>Width</td>
                        <td>Mining location</td>
                        <td>Mining Year</td>
                        <td>Extraction method</td>
                        <td>Selected</td>
                        <td>Price</td>
                        <td>Owner</td>
                      </thead>
                      <tbody>{renderMinedGems()}</tbody>
                    </table>

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
                        <td>Used</td>
                        <td>Price</td>
                        <td>Owner</td>
                      </thead>
                      <tbody>{renderSelectedGems()}</tbody>
                    </table>
                  </div>
            </div>
    );
  }


export default GemDetails;