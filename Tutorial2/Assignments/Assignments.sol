pragma solidity ^0.5.11;

//assignments in solidity 
//how to assign 
//to return values
//call values

contract Assignments {
    function returnFirstValue(uint a, uint b) public returns (uint) {
        return a;
    }
    
    function caller() public returns (uint) {
        return returnFirstValue({b:4, a:8});
    }
    
    function returnAllValues(uint a, uint b, uint c) public returns (uint, uint, uint) {
        return (a,b,c);
    }
    //still working on the updated solidity version
    //see solidity breaking changes online
    function callerAll() public returns (uint x, uint y, uint z) {
        x; y; z;  = returnAllValues(4,5,6);

        (x,y) = (y,x);
        (x,) = returnAllValues(5,10,15);
        (,z) = returnAllValues(10,20,30);
        return (x,y,z);
    }
}