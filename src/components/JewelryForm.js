import React, { useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function JewelryForm(props) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null); // Using ref for file input
  const { id } = useParams();

  const handleSubmit = async (event) => {
    console.log("preventdef bef")
    event.preventDefault();
    
    console.log("preventdef after")
    const formData = new FormData(event.target);
    const file = fileInputRef.current.files[0];
    
    let fileUrl = "";
    if (file) {
      try {
        const fileData = new FormData();
        fileData.append("file", file);

        const response = await axios.post(
          'https://api.pinata.cloud/pinning/pinFileToIPFS',
          fileData,
          {
            headers: {
              'pinata_api_key': process.env.REACT_APP_PINATA_API_KEY,
              'pinata_secret_api_key': process.env.REACT_APP_PINATA_PRIVATE_KEY,
            },
          }
        );
        fileUrl = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
        
      } catch (err) {
        console.error("Error uploading file: ", err);
        return;
      }
    }

    
    console.log("Form data: Size:", formData.get('size')); 
    

    formData.append('fileUrl', fileUrl);
    //const file = fileInputRef.current.files[0];

    console.log("file url:::::", fileUrl)

    const gemId = id;
    const name = formData.get('name').toString();
    const metal = formData.get('metal').toString();
    const depth = formData.get('depth');
    const height = formData.get('height');
    const width = formData.get('width');
    const price = window.web3.utils.toWei(formData.get('price'), 'Ether');
    const sale = true;


    if (!name) {
      console.error("Size is required.");
      return; // Megakadályozza a további végrehajtást, ha a méret nincs megadva
    }
    console.log(gemId + " " + name  + " " +  metal + " " + depth + " " + height + " " + width + " " + price + " " +  fileUrl)
    props.jewelryMaking(name, gemId, metal, depth, height, width, sale, price, fileUrl);
      // After submission logic, you might want to navigate the user to another route or show a success message.
    };
      
  
  


    return (
      <div className="card" style={{ 
        marginBottom: '20px', 
        padding: '20px', 
        backgroundColor: '#FFF7F3', 
        width: '90%', 
        margin: 'auto', 
        textAlign: 'center',
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
        marginTop: '60px' // Added marginTop for additional space
      }}>
        <h1>Add jewelry</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group mr-sm-2">
            <input id="name" name="name" type="text" className="form-control" placeholder="name" required />
          </div>
          <div className="form-group mr-sm-2">
            <input id="price" name="price" type="text" className="form-control" placeholder="price" required />
          </div>
          <div className="form-group mr-sm-2">
            <input id="depth" name="depth" type="text" className="form-control" placeholder="depth" required />
          </div>
          <div className="form-group mr-sm-2">
            <input id="height" name="height" type="text" className="form-control" placeholder="height" required />
          </div>
          <div className="form-group mr-sm-2">
            <input id="width" name="width" type="text" className="form-control" placeholder="width" required />
          </div>
          <div className="form-group mr-sm-2">
            <input id="metal" name="metal" type="text" className="form-control" placeholder="metal" required />
          </div>
          <div className="form-group mr-sm-2">
            <input type="file" ref={fileInputRef} className="form-control" />
          </div>
          <button type="submit"  className="custom-button btn btn-primary">Make jewelry</button>
        </form>
      </div>
    );
}

export default JewelryForm;
