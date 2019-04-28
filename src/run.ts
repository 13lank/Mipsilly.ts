import fs = require('fs');
import parser = require('./parser');
import assem = require('./asssembler')
import cons = require('./constants');
var argv = process.argv.slice(2);
function saveAsCoe(data: string[], path: string): void {
  var text: string = '# $1 instructions in total\nmemory_initialization_radix=16\;\
  \nmemory_initialization_vector= '.replace('$1', data.length.toString());
  text += data.reduce((s, x, i) => (s + (i % 10 === 0 ? '\n' : '') + x + ', '), '');
  fs.writeFile(path, text, { flag: 'w' }, err => {
    if (err) {
      console.log(err);
    }
    else console.log('Successfully saved to ' + path);
  });
}
argv.slice(2);
fs.readFile(argv[0], 'utf8', (err, data) => {
  if (err) console.log(err);
  else {
    var insts = parser.parseText(data);
    var save_path: string = argv.length <= 1 ? argv[0].slice(0, argv[0].indexOf('.mips')) + '.coe' : argv[1];
    saveAsCoe(assem.instsToBin(insts), save_path);
  }
})

