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
          <th scope="col">{gem.size.toString()}</th>
          <th scope="col">{gem.carat.toString()}</th>
          <th scope="col">{gem.color}</th>
          <th scope="col">{gem.gemType}</th>
          <th scope="col">{gem.polishing.toString()}</th>
          <th scope="col">{gem.used.toString()}</th>
          <th scope="col">{window.web3.utils.fromWei(gem.price.toString(), 'Ether')} Eth</th>
          <th scope="col">{gem.owner}</th>
          
          
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
          <th scope="col">{gem.gemType}</th>
          <th scope="col">{gem.weight.toString()}</th>
          <th scope="col">{gem.size.toString()}</th>
          <th scope="col">{gem.miningLocation}</th>
          <th scope="col">{gem.miningYear.toString()}</th>
          <th scope="col">{gem.extractionMethod}</th>
          <th scope="col">{gem.selected.toString()}</th>
          <th scope="col">{window.web3.utils.fromWei(gem.price.toString(), 'Ether')} Eth</th>
          <th scope="col">{gem.owner}</th>
          
          
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
                  <div id="tables" className="pt-5">
                    <table className="table">
                        <thead>
                        <th scope="col">ID</th>
                        <th scope="col">Type</th>
                        <th scope="col">Weight</th>
                        <th scope="col">Size</th>
                        <th scope="col">Mining location</th>
                        <th scope="col">Mining Year</th>
                        <th scope="col">Extraction method</th>
                        <th scope="col">Selected</th>
                        <th scope="col">Price</th>
                        <th scope="col">Owner</th>
                        </thead>
                        <tbody>{renderMinedGems()}</tbody>
                    </table>
                  </div>

                  <div id="tables" className="pt-5">
                    <h2>Data of selected gem</h2>
                    <table className="table">
                      <thead>
                      <th scope="col">ID</th>
                      <th scope="col">size</th>
                        <th scope="col">Carat</th>
                        <th scope="col">Color</th>
                        <th scope="col">Gemtype</th>
                        <th scope="col">Polishing</th>
                        <th scope="col">Used</th>
                        <th scope="col">Price</th>
                        <th scope="col">Owner</th>
                      </thead>
                      <tbody>{renderSelectedGems()}</tbody>
                    </table>
                  </div>
            </div>
    );
  }


export default GemDetails;