//--------------------------------- init --------------------------------------
//load the file system module
const fs = require('fs');
//lodash
var _ = require("lodash")

const readline = require('readline');

var changes = []

var configChanges = []

var path = []

//---------------------------------- functions ----------------------------------

const delPromise= async () => 
	{
	
	let result = await new Promise (r => fs.truncate('config.txt', 0, () => r("config.txt is empty")))
	let result2 = await new Promise (r => fs.truncate('configChanges.txt', 0, () => r("configChanges.txt is empty")))
	
	return "config files are empty";
	}

const promptPromise = async ch =>
  {
  
    for ( let i in ch) {

    	let result = await new Promise(r => promptUser(r,ch[i]));

    	if (result == true) {
    		let configString=`firebase functions:config:set ${ch[i][0]}="${ch[i][1]}"`
    		
    		configChanges.push(configString)
    		
    		fs.appendFileSync("configChanges.txt",configString + "\n");
    	}

    }
    
    return `That's all, the config changes are in configChanges.txt`
  }

function promptUser (resolve,config) {

	var configName=config[0]
	var displayText=""
	if (!config[1]) {
		displayText="Source value is missing."
	}
	else if (!config[2]) {
		displayText="Target value is missing."
	}
	else {
		displayText="Source and target values are different"
	}

	const rl = readline.createInterface({
	 input: process.stdin,
	 output: process.stdout,
	});


    
    rl.question( "----------------------------\n"
    	+ displayText +"\n"
    	+ configName + "\n"
    	+ "Overwrite this config?\n"
        + "y or n\n"
        , function (line) {

            switch (line){

                case "n":
                	rl.close();
                    resolve(false);
                    break;

                case "y":
                    rl.close();
                    resolve(true);
                    break;

                default:
                    console.log("No such option. Please enter another: ");
            		rl.close();
            		promptUser(resolve,config);
            		break;
            }
    
    });
};

const comparePromise = async (sourceD, targetD) =>
  {
  	
    let result = await new Promise(r => compFiles(r,sourceD, targetD, changes, "base"));
    let result2 = await new Promise(r => compFiles(r,targetD, sourceD, changes, "reverse"));

    return 'file comparison done'
  }

function compFiles(resolve,soD, taD, array, mode) {

	//to track where we are and indicate the last item
	var sourceItemCount = Object.keys(soD).length;
	
	for (var i in soD) {

		sourceItemCount -= 1
		//get the path as a string
		var pathString="";

		for (var item in path){
			pathString += path[item] + '.'
			}
		pathString += i;

		//if our item is a dictionary, we have to dig deeper
		if (typeof soD[i] == "object") {

			//before going down, let's add the current level to the path
			path.push(i)
			//the function calls itself
			compFiles(resolve,soD[i], taD[i], array, mode);
		}
		//else we got a string
		else {
			//if comparing source to target
			if (mode=="base") {
				//create line of backup config file
				let cfString=`firebase functions:config:set ${pathString}="${soD[i]}"`
				fs.appendFileSync("config.txt",cfString + "\n");
				//if source and target values differ
				if (soD[i]!=taD[i] && soD[i] && taD[i]) {

					array.push([pathString,soD[i],taD[i]])
				}
					
				else if (soD[i]!=taD[i] && !taD[i]) {

					array.push([pathString,soD[i],taD[i]])

				}

			}
			
			else if (mode="reverse") {

				if (!taD[i]) {

					array.push([pathString,taD[i],soD[i]])

				}
			}

		}

		
		//after the last item in the current dictionary we jump one level up,
      	//thus we have to delete the last item from our path list

		if (sourceItemCount == 0) {
			
			if (path=="") {

				resolve("recursion done");
			}

			path.pop()
		}
	}
	
}


module.exports = {

	compareFiles: function (sourceD, targetD) {

		//first make sure file is empty if it exist
			delPromise().then(out => {
			//first comparison
				console.log(out)
				comparePromise(sourceD, targetD).then(x => {
					//then user prompting
					console.log(x);
					promptPromise(changes).then(f => console.log(f));
				})
			})

										
	}
}

