import { Instruction } from './parser';
import parser = require('./parser');
import cons = require('./constants');
import { type } from 'os';
import { log } from 'util';
function immToBin(imm: number, len: number): number {
  if (imm >= (1 << len)) throw "Imm too large";
  return imm & ((1 << len) - 1);
}
function Hex32ToStr(bin: number): string {
  return ((bin >>> 16) + (1 << 16)).toString(16).slice(1) + ((bin & ((1 << 16) - 1)) + (1 << 16)).toString(16).slice(1);
}
export function instToBin(inst: Instruction, lbl_map: { [key: string]: number }): number {
  var params: { [key: string]: number } = {
    'rs': 0, 'rt': 0, 'sa': 0, 'op': 0, 'imm': 0
  };
  var inst_type = cons.operator.getType(inst.optr)
  for (var sop in cons.operator.SPECIAL_RT)
    if (sop === inst.optr)
      params['rt'] = cons.operator.SPECIAL_RT[sop];
  params['op'] = cons.operator.getCode(inst.optr);
  var tpl = cons.operator.getTemplate(inst.optr);
  var optype = cons.operator.getType(inst.optr);
  for (var i in inst.opnd) {

    switch (tpl[i]) {
      case 'imm':
        params['imm'] = immToBin(Number(inst.opnd[i]), cons.operator.IMM_LEN[optype === undefined ? 'R' : optype]);
        break;
      case 'label':
        params['imm'] = immToBin(optype === 'J' ? lbl_map[inst.opnd[i]] >>> 2 : ((lbl_map[inst.opnd[i]] - inst.addr) >>> 2) - 1, 16);
        break;
      default:
        params[tpl[i]] = cons.register.getNum(inst.opnd[i]);
    }
  }
  switch (optype) {
    case 'R':
      return (params['rs'] << 21) | (params['rt'] << 16) | (params['rd'] << 11)
        | (params['sa'] << 6) | params['op'];
      break;
    case 'I':
      return (params['op'] << 26) | (params['rs'] << 21) | (params['rt'] << 16)
        | params['imm'];
      break;
    default:
      return (params['op'] << 26) | params['imm'];
      break;
  }
}
export var instsToBin = (data: {
  inst_list: parser.Instruction[];
  lbl_map: {
    [key: string]: number;
  }
}) => data.inst_list.map(inst => instToBin(inst, data.lbl_map)).map(Hex32ToStr);

export { }