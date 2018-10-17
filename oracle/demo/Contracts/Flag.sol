pragma solidity ^0.4.24;

contract Flag {
    enum State {Open, Closed}
    State public _state;

    constructor() public {
        _state = State.Open;
    }

    function close() public {
        _state = State.Closed;
    }

    function open() public {
        _state = State.Open;
    }
}