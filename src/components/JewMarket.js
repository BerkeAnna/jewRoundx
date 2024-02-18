import React from 'react';
import { useNavigate } from 'react-router-dom';

function JewMarket({ jewelry, account }) {
  const navigate = useNavigate();

  const navigateToJewDetails = (jewId) => {
    navigate(`/jew-details/${jewId}`);
  };

  console.log("Jewelry Data:", jewelry); // Debugging: Check the jewelry data

  return (
    <div >
      <p>&nbsp;</p>
      <h2>Jew market :P</h2>
      <div id="tables">
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Price</th>
            <th scope="col">Owner</th>
            <th scope="col">Details</th>
            <th scope="col">Buy</th>
          </tr>
        </thead>
        <tbody>
          {jewelry && jewelry.map((jewelryItem, key) => {
            return(
              jewelryItem.owner !== account ? (
                <tr key={key}>
                  <th scope="row">{jewelryItem.id.toString()}</th>
                  <td>{jewelryItem.name}</td>
                  <td>{window.web3.utils.fromWei(jewelryItem.price.toString(), 'Ether')} Eth</td>
                  <td>{jewelryItem.owner}</td>
                  <td>
                    <button onClick={() => navigateToJewDetails(jewelryItem.id)}>
                      Details
                    </button>
                  </td>
                  <td>
                    <button>
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
      <div className='homeButton'>
      <button onClick={() => navigate(`/`)}>HOME PAGE</button>
      </div>
    </div>
  );
}

export default JewMarket;
