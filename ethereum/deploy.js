const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/Factory.json');
const MNEMONIC = "bridge bacon fit treat pudding tank where brand stable that cave vault"
const API = "https://rinkeby.infura.io/v3/6047a733ea644cd5a88358eff967ae41"

const provider = new HDWalletProvider(
  MNEMONIC,
  API
)
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(
    JSON.parse(compiledFactory.interface)
  )
    .deploy({ data: compiledFactory.bytecode })
    .send({ gas: '1000000', from: accounts[0] });

  console.log('Contract deployed to', result.options.address);
  provider.engine.stop();
};
deploy();