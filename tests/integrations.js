var colors = require('colors');
var expect = require('expect.js');
var testWebServer = require('./testWebServer');

var testStart;
var testStop;

console.log('..::Hulken Integration tests::..'.bold.inverse.cyan);
console.log('');
var runHulkenTestSuite = function(){
  console.log('.. calling on hulken'.bold.inverse.cyan);
  console.log('');
  var hulken = require('../hulken.js');
  var hulken_options = {
    targetUrl: 'http://localhost:5656',
    requestsFilePath: './tests/hulkenRequests.json',
    timesToRunEachRequest: 1
  };
  testStart = Date.now();
  hulken.run(function(stats){
      verify(stats); // we do not care about the performance of our testWebServer..
  }, function(stats) {
      verify(stats);
  }, hulken_options);
};

function verify(stats){
  try{
    expect(stats).to.exist;
    expect(stats).to.have.property('numberOfConcurrentRequests');
    expect(stats.numberOfConcurrentRequests).to.be.ok();
    expect(stats).to.have.property('numberOfUniqueRequests');
    expect(stats.numberOfUniqueRequests).to.be.ok();
    expect(stats).to.have.property('totalSecondsElapsed');
    expect(stats.totalSecondsElapsed).to.be.ok();
    expect(stats).to.have.property('avgReqResponseTime');
    expect(stats.avgReqResponseTime).to.be.ok();
    expect(stats).to.have.property('reqsPerSecond');
    expect(stats.reqsPerSecond).to.be.ok();
    expect(stats).to.have.property('randomRequestWaitTime');
    expect(stats.randomRequestWaitTime).to.be.ok();

    expect(stats.numberOfConcurrentRequests).to.equal(testWebServer.getReqsReceived());
    //since timesToRunEachRequest is set to 1
    expect(stats.numberOfUniqueRequests).to.equal(testWebServer.getReqsReceived());

    expect(testWebServer.getStartPageReqsReceived()).to.equal(1);
    expect(testWebServer.getSomeotherPageReqsReceived()).to.equal(1);
    expect(testWebServer.getPostsToStartPage()).to.equal(1);

    var postValues = testWebServer.getPostVars();
    expect(postValues).to.have.property('foo');
    expect(postValues.foo).to.be.ok();
    expect(postValues.foo).to.equal('bar');

    // if we get here without expect throwing any errors..
    passTest();
  }catch(expectError){
    console.log('.. Integration tests failed! =('.bold.inverse.red);
    console.log(expectError.toString().bold.inverse.red);
    console.log('');
    process.exit(code = 1);
  }

}
function passTest(){
  testStop = Date.now();
  var testExecutionTime = (testStop - testStart)/ 1000;
  console.log('.. Integration tests passed! =)'.bold.inverse.green);
  printExecutionTime();
  console.log('');
  process.exit(code = 0);
}
function printExecutionTime(){
  testStop = Date.now();
  var testExecutionTime = (testStop - testStart)/ 1000;
  console.log(('.. execution time: ' + testExecutionTime + ' seconds').bold.inverse.green);
}

//start the test http server and then start the test
testWebServer.start(runHulkenTestSuite);
