const newApp = artifacts.require('./newApp.sol')

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('NewApp',([deployer, seller, buyer]) => {
    let newApp 

    before(async () =>{
        newApp = await NewApp.deployed()
    })

    describe('deployment', async () => {
        it('deploy successfully', async () => {
            const address = await newApp.adress
            assert.notEqual(address, 0x0)
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        })

        it('has a name', async () => {
            const name = await newApp.name()
            assert.equal(name, 'New App')
        })
    })

    describe('products', async () => {
        let result, productCount
        
        before(async () =>{
            newApp = await newApp.createProduct('Product 1', web3.utils.toWei('1','Ether'), { from: seller })
            productCount = await newApp.productCount
        })

        it('creates products', async () => {
            //success
            assert.equal(productCount, 1)
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct')
            assert.equal(event.name, 'Product 1', 'Name is correct')
            assert.equal(event.price, '1000000000000000000', 'price is correct')
            assert.equal(event.owner, seller, 'owner is correct')
            assert.equal(event.purchased, false,  'purchased is correct')

            //failure: Product musthave a name 
            await await newApp.createProduct('',web3.utils.toWei('1','Ether'), { from:seller }).should.be.rejected;
            //failure: Product musthave a price
            await await newApp.createProduct('Product 1',0, { from:seller }).should.be.rejected;
        })

        it('sells products', aysnc () => {
            //Track seller balance before purchase
            let oldSellerBalance,
            oldSellerBalance = await web3.eth.getBalance(seller),
            oldSellerBalance = new web3.utils.BN(oldSellerBalance),

            //Success: Buyer makes purchase
            result = await newApp.purchaseProduct(productCount, { from: buyer, value: web3.utils.toWei('1','Ether')}),

            //Check logs
            const event = result.logs[0].args,
             
            assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct'),
            assert.equal(event.name, 'Product 1', 'Name is correct'),
            assert.equal(event.price, '1000000000000000000', 'price is correct'),
            assert.equal(event.owner, buyer, 'owner is correct'),
            assert.equal(event.purchased, true,  'purchased is correct')

            //Check seller received funds
            let newSellerBalance,
            newSellerBalance = await web3.eth.getBalance(seller),
            newSellerBalance = new web3.utils.BN(newSellerBalance)

            let price,
            price = web3.utils.toWei('1','Ether'),
            price = new web3.utilsBN(price)

            const expectedBalance = oldSellerBalance.add(price)
            assert.equal(newSellerBalance.toString(), expectedBalance.toString())

            //failure: Tries to buy product that does not exits
            await newApp.purchaseProduct(99, { from: buyer, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected,
            //failure: Buyer tries to buy without enough ether
            await newApp.purchaseProduct(productCount, { from: buyer, value: web3.utils.toWei('0.5', 'Ether')}).should.be.rejected,
            //failure: deployer tries to buy twice
            await newApp.purchaseProduct(productCount, { from: deployer, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected,
            //failure: buyer tries to buy again - buyer cant be seller
            await newApp.purchaseProduct(productCount, { from: buyer, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected,
        })
    })
})