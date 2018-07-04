//--------------------------------- init --------------------------------------
//load the file system module
const fs = require('fs');

const readline = require('readline');

var changes = []

var path = []

//---------------------------------- functions ----------------------------------

function AsyncRL (resolve,configName) {

	const rl = readline.createInterface({
	 input: process.stdin,
	 output: process.stdout,
	});
    
    rl.question( "----------------------------\n"
    	+ configName + "\n"
    	+ "Overwrite this config?\n"
        + "y or n\n"
        , function (line) {

            switch (line){

                case "n":
                	//console.log("No change")
                	rl.close();
                    resolve(false);
                    break;
                case "y":
                	//console.log("OK")
                    rl.close();
                    resolve(true);
                    break;
                default:
                    console.log("No such option. Please enter another: ");
            		rl.close();
            		AsyncRL(resolve,configName);
            		break;
            }
    
    });
};

const comparePromise = async (sourceD, targetD) =>
  {
  	
    let result = await new Promise(r => compFiles(r,sourceD, targetD));
    
    return 'comparison done'
  }

const promptPromise = async ch =>
  {
  
    for ( let i in ch) {

    	let result = await new Promise(r => AsyncRL(r,ch[i][0]));

    }
    
    return 'prompt done'
  }

function compFiles(resolve,sourceD, targetD) {

	//to track where we are and indicate the last item
	var sourceItemCount = Object.keys(sourceD).length;
	
	for (var i in sourceD) {

		sourceItemCount -= 1
		//get the path as a string
		var pathString="";

		for (var item in path){
			pathString += path[item] + '.'
			}
		pathString += i;

		//if our item is a dictionary, we have to dig deeper
		if (typeof sourceD[i] == "object") {

			//before going down, let's add the current level to the path
			path.push(i)
			//the function calls itself
			compFiles(resolve,sourceD[i], targetD[i]);
		}
		//else we got a string, that we can write in the file
		
		else {

			if (sourceD[i]!=targetD[i]) {
				//console.log("diff: ", pathString,"***",sourceD[i] , " - ", targetD[i])
				changes.push([pathString,sourceD[i],targetD[i]])

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

		comparePromise(sourceD, targetD).then(x => {
										console.log(x);
										promptPromise(changes).then(f => console.log(f))
										})
										
	}
}
