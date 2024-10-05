import React, { useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { firestore, storage } from '../../firebase'; // Firebase konfiguráció importálása
import { doc, setDoc } from 'firebase/firestore'; // Firestore for database operations
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Firebase Storage
import '../../styles/Forms.css';

function JewelryForm({ jewelryMaking, markGemAsUsed }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null); 
  const { id } = useParams();

  const handleMarkAsUsed = (gemId) => {
    markGemAsUsed(gemId);  // Meghívjuk a drágakő használatba vételét
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    handleMarkAsUsed(id);  // Meghívjuk a markGemAsUsed-et
    const formData = new FormData(event.target);
    const file = fileInputRef.current.files[0];
    
    let fileUrl = "";
    let docRef; // Firestore dokumentum referencia
    if (file) {
      try {
        // Fájl feltöltése a Firebase Storage-be
        const storageRef = ref(storage, `jewelry/${file.name}`);
        await uploadBytes(storageRef, file);
        fileUrl = await getDownloadURL(storageRef);
        console.log("File uploaded successfully to Firebase: ", fileUrl);
      } catch (err) {
        console.error("Error uploading file to Firebase: ", err);
        return;
      }
    }

    const gemId = parseInt(id, 10);  
    const name = formData.get('name').toString();
    const type = formData.get('type').toString();
    const metal = formData.get('metal').toString();
    const depth = formData.get('depth').toString();
    const height = formData.get('height').toString();
    const width = formData.get('width').toString();
    const size = `Depth: ${depth} mm - Height: ${height} mm - Width: ${width} mm`; 
    const additionalData = formData.get('additionalData').toString();
    const price = window.web3.utils.toWei(formData.get('price'), 'Ether');
    const sale = false;

    if (!name) {
      console.error("Name is required.");
      return; 
    }

    const metadata = {
      name,
      type,
      gemId,
      metal,
      size,
      additionalData,
      fileUrl // A feltöltött fájl URL-je
    };

    // Metaadatok feltöltése Firestore-ba
    try {
      docRef = doc(firestore, 'jewelry', `${Date.now()}_${name}`); // Dinamikus dokumentum azonosító
      await setDoc(docRef, metadata); // Metaadatok feltöltése a Firestore-ba
      console.log("Metadata successfully uploaded to Firebase Firestore");
    } catch (err) {
      console.error("Error uploading metadata to Firebase Firestore: ", err);
      return;
    }

    try {
      console.log("Submitting jewelry creation...");
      await jewelryMaking(name, gemId, docRef.id, sale, price, fileUrl);  // Helyes függvényhívás
      console.log("Jewelry created successfully.");
      navigate('/loggedIn');
    } catch (error) {
      console.error("Error in jewelry creation: ", error);
    }
  };

  return (
    <div className="card-container card-background">
      <div className="form-card">
        <h1>Add Jewelry</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input id="name" name="name" type="text" className="form-control" placeholder="Name" required />
          </div>
          <div className="form-group">
            <input id="type" name="type" type="text" className="form-control" placeholder="Type" required />
          </div>
          <div className="form-group">
            <input id="price" name="price" type="text" className="form-control" placeholder="Price in Ether" required />
          </div>
          <div className="form-group">
            <input id="depth" name="depth" type="text" className="form-control" placeholder="Depth in mm" required />
          </div>
          <div className="form-group">
            <input id="height" name="height" type="text" className="form-control" placeholder="Height in mm" required />
          </div>
          <div className="form-group">
            <input id="width" name="width" type="text" className="form-control" placeholder="Width in mm" required />
          </div>
          <div className="form-group">
            <input id="metal" name="metal" type="text" className="form-control" placeholder="Metal" required />
          </div>
          <div className="form-group">
            <input id="additionalData" name="additionalData" type="textarea" className="form-control" placeholder="Additional data" />
          </div>
          <div className="form-group">
            <input type="file" ref={fileInputRef} className="form-control" />
          </div>
          <button type="submit" className="button">Make Jewelry</button>
        </form>
      </div>
    </div>
  );
}

export default JewelryForm;
