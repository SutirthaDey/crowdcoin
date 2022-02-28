import web3 from './web3';
import Factory from './build/Factory.json';

const instance = new web3.eth.Contract(
  JSON.parse(Factory.interface),
  '0xcd1bED1FB8cf847bB18b3E195294Df5e2ab8d91b'
);

export default instance;