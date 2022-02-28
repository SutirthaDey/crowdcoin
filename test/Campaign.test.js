const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3"); 
const web3 = new Web3(ganache.provider());
const factory = require("../ethereum/build/Factory.json");
const campaign = require("../ethereum/build/Campaign.json");

let accounts,factoryInstance,campaignInstance,campaignAddress;

beforeEach(async()=>{
    accounts = await web3.eth.getAccounts();

    factoryInstance = await new web3.eth.Contract(JSON.parse(factory.interface))
    .deploy({data: factory.bytecode})
    .send({from: accounts[0],gas: "1000000"});

    await factoryInstance.methods.addCampaign("100").send({
        from: accounts[0],
        gas:"1000000"
    })
    
    const deployedCampaigns = await factoryInstance.methods.getCampaigns().call();
    
    campaignAddress = deployedCampaigns[deployedCampaigns.length-1];

    campaignInstance = await new web3.eth.Contract(JSON.parse(campaign.interface),campaignAddress); // campaign address is passed because the contract is already deployed in the address
});

describe('kickstart',()=>{
    it('factory and campaign deployed',()=>{
        assert.ok(factoryInstance.options.address);
        assert.ok(campaignInstance.options.address);

    });
    it('manager',async ()=>{
        const manager = await campaignInstance.methods.manager().call();
        assert.equal(manager,accounts[0]);
    })
    it('adding approver',async ()=>{
        await campaignInstance.methods.addApprovers().send({
            from: accounts[1],
            value: '101',
            gas: '1000000'
        })
        const isApprover = await campaignInstance.methods.approvers(accounts[1]).call();
        assert.ok(isApprover);
    })
    it('create request and approve and finalize', async()=>{
        await campaignInstance.methods.createRequest("buy",accounts[2],100).send({
            from: accounts[0],
            gas:'1000000'
        });

        await campaignInstance.methods.addApprovers().send({
            from: accounts[1],
            value: '101',
            gas: '1000000'
        })

        await campaignInstance.methods.approveRequest(0).send({
            from: accounts[1],
            gas: '1000000'
        })
        const requests = await campaignInstance.methods.requests(0).call();
        assert.equal(requests.approvalCounts,1);
        assert(requests.complete);
    })
    it('Who sends transactions', async()=>{
        await campaignInstance.methods.createRequest("buy",accounts[2],100).send({
            from: accounts[0],
            gas:'1000000'
        });  // request created from acc 0

        await campaignInstance.methods.addApprovers().send({
            from: accounts[2],
            value: '101',
            gas: '1000000'
        })  // approver acc 1

        await campaignInstance.methods.approveRequest(0).send({
            from: accounts[2],
            gas: '1000000'
        }) // approves request acc 1

        const vote = await campaignInstance.methods.didVote(0).call({
            from: accounts[2]
        }); // checks if voted
        assert.equal(true,vote);
    })  
});