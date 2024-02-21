
import React, { useState } from 'react';
import "./App.css";
import axios from 'axios';

function App() {
  const [count, setCount] = useState(0);
  const [file, setFile] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const fileData = new FormData();
      fileData.append("file", file);

      console.log("prv key:" + process.env.REACT_APP_PINATA_PRIVATE_KEY)

      const responseData = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data: fileData,
        headers: {
          pinata_api_key:  process.env.REACT_APP_PINATA_API_KEY,
          pinata_secret_api_key: process.env.REACT_APP_PINATA_PRIVATE_KEY,
          "Content-Type": "multipart/form-data", 
        },
      });

      const fileUrl = "https://coral-biological-monkey-396.mypinata.cloud/ipfs/" + responseData.data.IpfsHash;
      console.log(fileUrl);
      setFileUrl(fileUrl);
    }catch(err){
      console.log(err)
    }
  }

  return(
    <div>
      <h1>IPFS upload your file</h1>
      <form>
        <input type="file" onChange={(e)=>setFile(e.target.files[0])}/>
        <button type="submit" onClick={handleSubmit}>Upload</button>
      </form>
      {
        fileUrl && (
          <div>
          <a href={fileUrl} target="_blank" rel="noopener noreferrer">Kattints ide a teljes méretű kép megtekintéséhez</a>
          <img src={fileUrl} alt="Feltöltött kép" style={{maxWidth: '100%', maxHeight: '500px', marginTop: '20px'}} />
        </div>
        )
      }
    </div>

  )
}

export default App;