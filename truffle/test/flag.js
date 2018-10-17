var Flag = artifacts.require("./Flag.sol");

contract('Flag state change', function (accounts) {
  it("should change flag state", async () => {
    var instance = await Flag.deployed();
    let x = await instance.close();
    console.log(x);
  });
});