"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
;
function parseLine(str, addr) {
    var commentpos = str.indexOf('#');
    if (commentpos >= 0)
        str = str.slice(0, commentpos);
    commentpos = str.indexOf(';');
    if (commentpos >= 0)
        str = str.slice(0, commentpos);
    var params = str.split(/[\,, \s,\(,\),\"\']+/);
    if (params.length > 0 && params[0] === '')
        params.splice(0, 1);
    if (params.length > 0 && params[params.length - 1] === '')
        params.pop();
    var inst = { optr: "", opnd: [], addr: 0 };
    var lbl = '';
    if (params.length > 0 && params[0][params[0].length - 1] === ':') {
        lbl = params[0].slice(0, -1);
        params.splice(0, 1);
    }
    if (params.length > 0) {
        inst['optr'] = params[0].toUpperCase();
        params.splice(0, 1);
    }
    inst['opnd'] = params;
    return { inst: inst, lbl: lbl };
}
exports.parseLine = parseLine;
function parseText(text) {
    var parse_res = text.split(/\n+/).map(parseLine);
    var inst_list = [];
    var lbl_map = {};
    for (var i in parse_res) {
        if (parse_res[i].lbl !== '')
            lbl_map[parse_res[i].lbl] = inst_list.length << 2;
        if (parse_res[i].inst.optr !== '') {
            parse_res[i].inst.addr = inst_list.length << 2;
            inst_list.push(parse_res[i].inst);
        }
    }
    return { inst_list: inst_list, lbl_map: lbl_map };
}
exports.parseText = parseText;
