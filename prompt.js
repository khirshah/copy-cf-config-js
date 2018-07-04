const fs = require('fs');

const readline = require('readline');


function AsyncRL (resolve) {

	const rl = readline.createInterface({
	 input: process.stdin,
	 output: process.stdout,
	});
    
    rl.question("Overwrite this config?\n"
        + "y or n\n"
        , function (line) {
        	console.log("line: ", line)
            switch (line){

                case "n":
                	console.log("No change")
                	rl.close();
                    resolve("No");
                    break;
                case "y":
                	console.log("OK")
                    rl.close();
                    resolve("Yes");
                    break;
                default:
                    console.log("No such option. Please enter another: ");
            		rl.close();
            		resolve("def");
            		break;
            }
    
    });
};


const someProcedure = async n =>
  {
    for (let i = 0; i < n; i++) {

      let result = await new Promise(r => AsyncRL(r));

    }
    
    return 'done'
  }

someProcedure(5).then(x => console.log(x))