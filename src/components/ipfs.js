
import axios  from 'axios';
var FormData = require('form-data');
var data = new FormData();

var config = {
  method: 'get',
  url: 'https://api.pinata.cloud/data/testAuthentication',
  headers: {
    'Authorization': 'Bearer ' + process.env.JWT
  }
}

export async function connect () {
  try{
    const res = await axios(config)
  
    console.log(res.data)

  } catch (e){
    console.error(e)
  }
}

export async function uploadFileToIPFS(value, callback) {
  data.append('file', value.file);
  data.append('pinataOptions', '{"cidVersion": 1}');
  data.append('pinataMetadata', `{"name": ${value.file.name}, "keyvalues": {"company": "Pinata"}}`);
  const res = await axios(config)
  callback(res.data)

}

