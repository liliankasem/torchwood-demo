pragma solidity ^0.4.24;

contract DownloadEventDemo {
    address public owner;
    event DownloadRequestEvent(address sender);
	string test;
	
    constructor() public {
        owner = msg.sender;
		test = request();
		
    }
    function request() public returns (string) {
        emit DownloadRequestEvent(msg.sender);
        return "sent";
    }
}