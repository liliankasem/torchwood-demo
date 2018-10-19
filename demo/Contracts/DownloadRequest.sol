pragma solidity ^0.4.24;

contract DownloadRequest {
    address public owner;
    event DownloadRequestEvent(address sender);

    constructor() public {
        owner = msg.sender;
    }
    function request() public returns (string) {
        emit DownloadRequestEvent(msg.sender);
        return "sent";
    }
}