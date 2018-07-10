//load data
var sourceData=require('./sourceData.json');
var targetData=require('./targetData.json');
//load file to run
var comp=require("./compare.js");
//run file content
comp.compareFiles(sourceData,targetData);