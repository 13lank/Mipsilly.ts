"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cons = require("./constants");
function immToBin(imm, len) {
    if (imm >= (1 << len))
        throw "Imm too large";
    return imm & ((1 << len) - 1);
}
function Hex32ToStr(bin) {
    return ((bin >>> 16) + (1 << 16)).toString(16).slice(1) + ((bin & ((1 << 16) - 1)) + (1 << 16)).toString(16).slice(1);
}
function instToBin(inst, lbl_map) {
    var params = {
        'rs': 0, 'rt': 0, 'sa': 0, 'op': 0, 'imm': 0
    };
    var inst_type = cons.operator.getType(inst.optr);
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
exports.instToBin = instToBin;
exports.instsToBin = (data) => data.inst_list.map(inst => instToBin(inst, data.lbl_map)).map(Hex32ToStr);
