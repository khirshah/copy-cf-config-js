const fs = require('fs');

var sourceData=require('./sourceData.json');
var targetData=require('./targetData.json');

var ref=require("./reformat.js");
var comp=require("./compare.js");


//ref.dictToList(sourceData);
comp.compareFiles(sourceData,targetData);