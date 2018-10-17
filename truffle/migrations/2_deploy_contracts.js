var DownloadRequest = artifacts.require("./DownloadRequest.sol");
var Flag = artifacts.require("./Flag.sol");

module.exports = function(deployer) {
  deployer.deploy(DownloadRequest);
  deployer.deploy(Flag);
};
