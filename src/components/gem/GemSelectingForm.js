import React, { useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { firestore, storage } from '../../firebase'; // Update the path based on your structure
import { doc, setDoc } from 'firebase/firestore'; // Firestore for database operations
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // For handling image upload to Firebase Storage

function GemSelectingForm(props) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { id } = useParams(); // Gem ID, amit kiválasztottak

  const handleMarkAsSelected = (gemId) => {
    props.markGemAsSelected(gemId); 
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    handleMarkAsSelected(id);
    const formData = new FormData(event.target);
    const file = fileInputRef.current.files[0];

    let fileUrl = "";
    let docRef; // Firestore dokumentum referencia
    if (file) {
      try {
        // Upload file to Firebase Storage
        const storageRef = ref(storage, `gems/${file.name}`);
        await uploadBytes(storageRef, file);
        fileUrl = await getDownloadURL(storageRef);
        console.log("File uploaded successfully to Firebase: ", fileUrl);
      } catch (err) {
        console.error("Error uploading file to Firebase: ", err);
        return;
      }
    }

    // A form mezők beállítása
    const color = formData.get('color').toString();
    const gemType = formData.get('gemType').toString();
    const polishing = formData.get('polishing').toString();
    const transparency = formData.get('transparency').toString();
    const treatments = formData.get('treatments').toString();
    const price = window.web3.utils.toWei(formData.get('price'), 'Ether');
    const depth = formData.get('depth').toString();
    const height = formData.get('height').toString();
    const width = formData.get('width').toString();
    const size = `${depth}x${height}x${width} mm`;
    const carat = formData.get('carat').toString();

    const metadata = {
      gemType,
      color,
      polishing,
      transparency,
      treatments,
      size,
      carat,
      fileUrl // A feltöltött fájl URL-je
    };

    // Metaadatok feltöltése Firestore-ba
    try {
      docRef = doc(firestore, 'gems', `${Date.now()}_${gemType}`); // Dinamikus dokumentum azonosító
      await setDoc(docRef, metadata); // Metaadatok feltöltése a Firestore-ba
      console.log("Metadata successfully uploaded to Firebase Firestore");
    } catch (err) {
      console.error("Error uploading metadata to Firebase Firestore: ", err);
      return;
    }

    const minedGemId = parseInt(id, 10);

    try {
      console.log("Submitting gem selection...");
      await props.gemSelecting(minedGemId, docRef.id, price); // Az ID alapján történik a kiválasztás
      console.log("Gem selected successfully.");
      navigate('/loggedIn');
    } catch (error) {
      console.error("Error in gemSelecting: ", error);
    }
  };

  return (
    <div className="card-container card-background">
      <div className="form-card">
        <h1>Select Gem</h1>
        <form onSubmit={handleSubmit}>
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
            <input id="carat" name="carat" type="text" className="form-control" placeholder="Carat" required />
          </div>
          <div className="form-group">
            <input id="color" name="color" type="text" className="form-control" placeholder="Color" required />
          </div>
          <div className="form-group">
            <input id="polishing" name="polishing" type="text" className="form-control" placeholder="Polishing" required />
          </div>
          <div className="form-group">
            <input id="transparency" name="transparency" type="text" className="form-control" placeholder="Transparency" required />
          </div>
          <div className="form-group">
            <input id="treatments" name="treatments" type="text" className="form-control" placeholder="Treatments" required />
          </div>
          <div className="form-group">
            <input id="gemType" name="gemType" type="text" className="form-control" placeholder="Gem Type" required />
          </div>
          <div className="form-group">
            <input id="price" name="price" type="text" className="form-control" placeholder="Price in Ether" required />
          </div>
          <div className="form-group">
            <input type="file" ref={fileInputRef} className="form-control" />
          </div>
          <button type="submit" className="button">Gem processing</button>
        </form>
      </div>
    </div>
  );
}

export default GemSelectingForm;
