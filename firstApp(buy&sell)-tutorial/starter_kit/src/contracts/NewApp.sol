pragma solidity >=0.4.21 <0.6.0;

//business logic buysell on the bc - writeread from bc
contract newApp {
    string public name;
    uint public productCount = 0;
    mapping(uint => Product) public products;

    struct Product {
        uint id;
        string name;
        uint price;
        address payable owner;
        bool purchased;

    }

    event ProductCreated(
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased
    );

    event ProductPurchased(
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased
    );

    constructor() public{
        name = "MyNewApp";
    }

    function createProduct(string memory _name, uint _price) public {
        //Require name
        require(bytes(_name).length > 0);
        //Valid price
        require( _price > 0);
        //Increment product count
        productCount ++;
        //create product
        products[productCount] = Product(productCount, _name, _price, msg.sender, false);
        //trigger event
        emit ProductCreated(productCount, _name, _price, msg.sender, false);
    }

    function purchaseProduct(uint _id) public payable{
        // Fetch the product
        Product memory _product = products[_id];
        //Fetch owner
        address _seller = _product.owner;
        //Make sure product is valid ID
        require(_product.id > 0 && _product.id < productCount);
        // Require enough ether in transaction
        require(msg.value >= _product.price);
        //require product not purchased already
        require(!_product.purchased);
        //require buyer is not the seller
        require(_seller != msg.sender);
        //Transfer ownership
        _product.owner = msg.sender;
        //Mark as purchased
        _product.purchased = true;
        //Update the product
        products[_id] = _product;
        //Pay seller - send eth
        //address(_seller).transer(msg.value);
        //Trigger event
        emit ProductPurchased(productCount, _product.name, _product.price, msg.sender, true);

    }

}
