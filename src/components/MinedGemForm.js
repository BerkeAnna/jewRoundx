import React from 'react';
import { useNavigate } from 'react-router-dom';

function Main(props) {
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const gemType = event.target.gemType.value;
    const price = window.web3.utils.toWei(event.target.price.value.toString(), 'Ether');
    const weight = event.target.weight.value;
    const height = event.target.height.value;
    const width = event.target.width.value;
    const miningLocation = event.target.miningLocation.value;
    const miningYear = event.target.miningYear.value;
    const extractionMethod = event.target.extractionMethod.value;

   
    props.gemMining(gemType, weight, height, width, price, miningLocation, miningYear, extractionMethod, false);

    

  };

  return (
    <div id="content">
      <h1>Add Product</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group mr-sm-2">
          <input id="gemType" type="text" className="form-control" placeholder="Type" required />
        </div>
        <div className="form-group mr-sm-2">
          <input id="price" type="text" className="form-control" placeholder="Price" required />
        </div>
        <div className="form-group mr-sm-2">
          <input id="weight" type="text" className="form-control" placeholder="Weight" required />
        </div>
        <div className="form-group mr-sm-2">
          <input id="height" type="text" className="form-control" placeholder="Height" required />
        </div>
        <div className="form-group mr-sm-2">
          <input id="width" type="text" className="form-control" placeholder="Width" required />
        </div>
        <div className="form-group mr-sm-2">
          <input id="miningLocation" type="text" className="form-control" placeholder="Mining Location" required />
        </div>
        <div className="form-group mr-sm-2">
          <input id="miningYear" type="text" className="form-control" placeholder="Mining Year" required />
        </div>
        <div className="form-group mr-sm-2">
          <input id="extractionMethod" type="text" className="form-control" placeholder="Extraction Method" required />
        </div>

        <button type="submit" className="btn btn-primary" >Add Product</button>
      </form>
    </div>
  );
}

export default Main;
