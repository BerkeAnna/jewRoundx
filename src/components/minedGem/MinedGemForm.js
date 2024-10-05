import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { firestore, storage } from '../../firebase'; // Update the path based on your structure
import { doc, setDoc } from 'firebase/firestore'; // Firestore for database operations
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // For handling image upload to Firebase Storage

import '../../styles/Forms.css';

function MinedGemForm(props) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const formData = new FormData(event.target);
    const file = fileInputRef.current.files[0];
  
    let fileUrl = "";
    let docRef; // Declare docRef here
    if (file) {
      try {
        // Upload file to Firebase Storage
        const storageRef = ref(storage, `minedGems/${file.name}`);
        await uploadBytes(storageRef, file);
        fileUrl = await getDownloadURL(storageRef);
      } catch (err) {
        console.error("Error uploading file to Firebase: ", err);
        return;
      }
    }
  
    const gemType = formData.get('gemType').toString();
    const price = window.web3.utils.toWei(formData.get('price'), 'Ether');
    const weight = formData.get('weight').toString();
    const depth = formData.get('depth').toString();
    const height = formData.get('height').toString();
    const width = formData.get('width').toString();
    const size = `${depth}x${height}x${width}`; 
    const details = `Carat: ${weight} ct, Size: ${size} mm, Image: ${fileUrl}`;
  
    // Metaadatok létrehozása
    const metadata = {
      gemType,
      weight,
      size,
      miningLocation: formData.get('miningLocation').toString(),
      miningYear: formData.get('miningYear').toString(),
      fileUrl, // Az itt létrehozott URL az elmentett fájlhoz
    };
  
    // Metaadatok feltöltése Firestore-ba
    try {
      docRef = doc(firestore, 'minedGems', `${Date.now()}_${gemType}`); // Assign docRef here
      await setDoc(docRef, metadata); // Metaadatok feltöltése a Firestore-ba
      console.log("Metadata successfully uploaded to Firebase Firestore");
    } catch (err) {
      console.error("Error uploading metadata to Firebase Firestore: ", err);
      return;
    }
  
    try {
      await props.gemMining(gemType, price, docRef.id, false); // On-chain csak az ID
    } catch (error) {
      console.error("Error in gemMining: ", error);
    }
  
    navigate('/loggedIn');
  };
  

  return ( 
  <div className="card-container card-background">
    <div className="form-card">
      <h1>Add Mined Gem</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input id="gemType" name="gemType" type="text" className="form-control" placeholder="Type" required />
        </div>
        <div className="form-group">
          <input id="price" name="price" type="text" className="form-control" placeholder="Price in Ether" required />
        </div>
        <div className="form-group">
          <input id="weight" name="weight" type="text" className="form-control" placeholder="Weight" required />
        </div>
        <div className="form-group">
          <input id="depth" name="depth" type="text" className="form-control" placeholder="Depth" required />
        </div>
        <div className="form-group">
          <input id="height" name="height" type="text" className="form-control" placeholder="Height" required />
        </div>
        <div className="form-group">
          <input id="width" name="width" type="text" className="form-control" placeholder="Width" required />
        </div>
        <div className="form-group">
          <input id="miningLocation" name="miningLocation" type="text" className="form-control" placeholder="Mining Location" required />
        </div>
        <div className="form-group">
          <input id="miningYear" name="miningYear" type="text" className="form-control" placeholder="Mining Year" required />
        </div>
        <div className="form-group">
          <input type="file" name="image" ref={fileInputRef} className="form-control" />
        </div>
        <button type="submit" name="addMinedGem" className="button">Add Mined Gem</button>
      </form>
    </div>
  </div>
  );
}

export default MinedGemForm;
