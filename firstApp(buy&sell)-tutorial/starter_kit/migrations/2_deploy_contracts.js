/* eslint-disable no-undef */
const TestApp = artifacts.require("TestApp");

module.exports = function(deployer) {
  deployer.deploy(TestApp);
};
