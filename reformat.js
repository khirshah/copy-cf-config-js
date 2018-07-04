//_--------------------------- INIT -------------------------------------------

const fs = require('fs');

var path = []

var configList = []
//--------------------------- functions ---------------------------------
//define function to iterate trough our nested dictionary
// and write the value-key pairs into a txt
module.exports = {

	dictToList: function (d) {
		//delete source file content first
		fs.truncate('config.txt', 0, function() {
			console.log('clear done')
			//then call the actual handler function
			createConfigFile(d);
		});

	}
}


function createConfigFile(d){
	//to track where we are and indicate the last item
	var itemCount = Object.keys(d).length;
	for (var i in d) {
		itemCount -= 1
		//if our item is a dictionary, we have to dig deeper
		if (typeof d[i] == "object") {
			//before going down, let's add the current level to the path
			path.push(i)
			//the function calls itself
			createConfigFile(d[i]);
		}
		//else we got a string, that we can write in the file
		else {
			var string = 'firebase functions:config:set '
			//we iterate through the list containing the full path,
            //picking the items one by one  
			for (var item in path){
				string += path[item] + '.'
			}
			string += i + '=' + d[i];
			configList.push(string)
			fs.appendFileSync('config.txt', string + "\n");
			//after the last item in the current dictionary we jump one level up,
      		//thus we have to delete the last item from our path list
			if (itemCount == 0) {
				path.pop()
			}
		}
	}

}


//dictToList(data);
//console.log(configList)