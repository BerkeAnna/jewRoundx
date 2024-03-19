import React, { Component } from 'react';
import { useParams } from 'react-router-dom';

function JewDetails({ selectedGems, minedGems, jewelry,account  }) {

  const { id } = useParams();
  const gemId = id;
  //todo: selected gem, aminke az id-ja megegyezik az urlben lévővel.
    const gemSelected = selectedGems;
    const minedGem = minedGems;
    const JewelryD = jewelry;

  const renderSelectedGems = () => {
    
    console.log(gemId)
    return gemSelected.map((gem, key) => (
      //todo: id page
      gem.id == gemId &&(
        <tr key={key}>
          <th scope="row">{gem.id.toString()}</th>
          <td>{gem.size.toString()} mm</td>
          <td>{gem.carat.toString()} ct</td>
          <td>{gem.color}</td>
          <td>{gem.gemType}</td>
          <td>{gem.polishing.toString()}</td>
          
          <td>
                {
            gem.fileURL && (
              <div>
              <a href={gem.fileURL} target="_blank" rel="noopener noreferrer"><img src={gem.fileURL} alt="Feltöltött kép" style={{maxWidth: '100%', maxHeight: '500px', marginTop: '20px'}} /></a>

            </div>
            )
          }
          </td>
          <td>{gem.used.toString()}</td>
          <td>{window.web3.utils.fromWei(gem.price.toString(), 'Ether')} Eth</td>
          <td>{gem.owner}</td>
          <td>{gem.fileURL}</td>
          
          
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
          <td>{gem.weight.toString()} mm</td>
          <td>{gem.size.toString()} mm</td>
          <td>{gem.miningLocation}</td>
          <td>{gem.miningYear.toString()}</td>
          <td>
                {
            gem.fileURL && (
              <div>
              <a href={gem.fileURL} target="_blank" rel="noopener noreferrer"><img src={gem.fileURL} alt="Feltöltött kép" style={{maxWidth: '100%', maxHeight: '500px', marginTop: '20px'}} /></a>
              
            </div>
            )
          }
          </td>
          <td>{gem.selected.toString()}</td>
          <td>{window.web3.utils.fromWei(gem.price.toString(), 'Ether')} Eth</td>
          <td>{gem.owner}</td>
          <td>{gem.fileURL}</td>
          
          
        </tr>
      )
    ));
  };
  const renderJewelry = () => {
    
    console.log(gemId)
    return JewelryD.map((jewelry, key) => (
      //todo: id page
      jewelry.id == gemId &&(
        //todo a megfelelo oszlopkora átrni
        <tr key={key}>
          <th scope="row">{jewelry.id.toString()}</th>
          <td>{jewelry.name}</td>
          
          <td>{jewelry.metal.toString()} </td>
          <td>{jewelry.depth.toString()} mm</td>
          <td>{jewelry.height.toString()} mm</td>
          <td>{jewelry.width.toString()} mm</td>
   
          <td>{jewelry.sale.toString()}</td>
          <td>{window.web3.utils.fromWei(jewelry.price.toString(), 'Ether')} Eth</td>
        
          <td>
          {jewelry.fileURL && (
            <div>
              <a href={jewelry.fileURL} target="_blank" rel="noopener noreferrer">
                <img src={jewelry.fileURL} alt="Jewelry" style={{maxWidth: '100%', maxHeight: '500px', marginTop: '20px'}} />
              </a>
            </div>
          )}
          </td>
         
          <td>{jewelry.jeweler}</td>
          <td>{jewelry.owner}</td>
          <td>{jewelry.fileURL}</td>
          
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
                  <div id="tables">
                  todo: minedgem datas ending ---- in process
                  <table className="table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Type</th>
                          <th>Weight</th>
                          <th>Size</th>
                          <th>Mining location</th>
                          <th>Mining Year</th>
                          <th>Picture</th>
                          <th>Selected</th>
                          <th>Price</th>
                          <th>Owner</th>
                        </tr>
                      </thead>
                      <tbody>{renderMinedGems()}</tbody>
                    </table>
                    </div>

                  <div id="tables" className="pt-5">
                    <h2>Data of selected gem</h2>
                    <div id="tables">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Size</th>
                          <th>Carat</th>
                          <th>Color</th>
                          <th>Gemtype</th>
                          <th>Polishing</th>
                          <th>Picture</th>
                          <th>Used</th>
                          <th>Price</th>
                          <th>Owner</th>
                        </tr>
                      </thead>
                      <tbody>{renderSelectedGems()}</tbody>
                    </table>
                    </div>
                  </div>

                  <div id="tables" className="pt-5">
                    <h2>Data of jewelry</h2>
                    <div id="tables">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Metal</th>
                          <th>Depth</th>
                          <th>Height</th>
                          <th>Width</th>
                          <th>Sale</th>
                          <th>Price</th>
                          <th>Picture</th>
                          <th>Jeweler</th>
                          <th>Owner</th>
                        </tr>
                      </thead>
                      <tbody>{renderJewelry()}</tbody>
                    </table>
                    </div>
                  </div>
                  
            </div>
    );
  }


export default JewDetails;