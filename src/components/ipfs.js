/*const { create } = require('ipfs-http-client');
const projectId = '3b75f15f3d184d749681f209f4de2913';
const projectSecret = '94a73e4ddb324032bcb64af4cd3e591f';
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const ipfs = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
});
*/
// Now you can use `ipfs` to interact with IPFS through Infura with authentication
/*/*const IPFS = require('ipfs-api');

const projectId = '3b75f15f3d184d749681f209f4de2913';
const projectSecret = '94a73e4ddb324032bcb64af4cd3e591f';
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https', });

export default ipfs;
*/
/*
const { create } = require('ipfs-http-client');
// Az Infura projekt azonosítója és jelszava
const projectId = '3b75f15f3d184d749681f209f4de2913';
const projectSecret = '94a73e4ddb324032bcb64af4cd3e591f';
// Az azonosítót és a jelszót Base64 kódolásban kell megadni
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const ipfs = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  }
});
export default ipfs;
*/