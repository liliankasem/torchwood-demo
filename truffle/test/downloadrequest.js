// var DownloadRequest = artifacts.require("./DownloadRequest.sol");

// contract('Download Request Event', function (accounts) {
//   it("should send a download request event", async () => {
//     var instance = await DownloadRequest.deployed();
//     var downloadRequest = await instance.request.call();

//     assert.equal(downloadRequest.valueOf(), "sent", "didn't send request");

//     let contractDownloadRequest = download.methods.request().send()
//         .then(function(result) {
//             console.log("Call to request result: " + result);
//         }, function(error) {
//             console.log("Error: "  + error);
//         });

//     await contractDownloadRequest;
//     return "Download request made";
//   });
// });