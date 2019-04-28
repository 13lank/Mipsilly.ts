"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var operator;
(function (operator) {
    const OP_CODE = {
        ADD: 0b100000,
        ADDI: 0b001000,
        ADDIU: 0b001001,
        ADDU: 0b100001,
        AND: 0b100100,
        ANDI: 0b001100,
        BEQ: 0b000100,
        BGEZ: 0b000001,
        BGEZAL: 0b000001,
        BGTZ: 0b000111,
        BLEZ: 0b000110,
        BLTZ: 0b000001,
        BLTZAL: 0b000001,
        BNE: 0b000101,
        DIV: 0b011010,
        DIVU: 0b011011,
        J: 0b000010,
        JAL: 0b000011,
        JALR: 0b001001,
        JR: 0b001000,
        LB: 0b100000,
        LBU: 0b100100,
        LH: 0b100001,
        LHU: 0b100101,
        LUI: 0b001111,
        LW: 0b100011,
        MFHI: 0b010000,
        MFLO: 0b010010,
        MTHI: 0b010001,
        MTLO: 0b010011,
        MULT: 0b011000,
        MULTU: 0b011001,
        NOR: 0b100111,
        OR: 0b100101,
        ORI: 0b001101,
        SB: 0b101000,
        SH: 0b101001,
        SLL: 0b000000,
        SLLV: 0b000100,
        SLT: 0b101010,
        SLTI: 0b001010,
        SLTIU: 0b001011,
        SLTU: 0b101011,
        SRA: 0b000011,
        SRAV: 0b000111,
        SRL: 0b000010,
        SRLV: 0b000110,
        SUB: 0b100010,
        SUBU: 0b100011,
        SW: 0b101011,
        SWC1: 0b111001,
        SYSCALL: 0b001100,
        XOR: 0b100110,
        XORI: 0b001110,
    };
    const R_set = [
        'ADD', 'ADDU', 'AND', 'DIV', 'DIVU', 'JALR', 'JR', 'MFHI', 'MFLO', 'MTHI',
        'MTLO', 'MULT', 'MULTU', 'NOR', 'OR', 'SLL', 'SLLV', 'SLT', 'SLTU', 'SRA',
        'SRAV', 'SRL', 'SRLV', 'SUB', 'SUBU', 'SYSCALL', 'XOR'
    ];
    const I_set = [
        'ADDI', 'ADDIU', 'ANDI', 'BEQ', 'BGEZ', 'BGEZAL', 'BGTZ', 'BLEZ', 'BLTZ',
        'BLTZAL', 'BNE', 'LB', 'LBU', 'LH', 'LHU', 'LUI', 'LW', 'ORI', 'SB', 'SLTI',
        'SLTIU', 'SH', 'SW', 'SWC1', 'XORI'
    ];
    const INST_TEMPLATE = {
        'ADD': ['rd', 'rs', 'rt'],
        'ADDI': ['rt', 'rs', 'imm'],
        'ADDIU': ['rt', 'rs', 'imm'],
        'ADDU': ['rd', 'rs', 'rt'],
        'AND': ['rd', 'rs', 'rt'],
        'ANDI': ['rt', 'rs', 'imm'],
        'BEQ': ['rs', 'rt', 'label'],
        'BGEZ': ['rs', 'label'],
        'BGEZAL': ['rs', 'label'],
        'BGTZ': ['rs', 'label'],
        'BLEZ': ['rs', 'label'],
        'BLTZ': ['rs', 'label'],
        'BLTZAL': ['rs', 'label'],
        'BNE': ['rs', 'rt', 'label'],
        'BREAK': [],
        'DIV': ['rs', 'rt'],
        'DIVU': ['rs', 'rt'],
        'J': ['label'],
        'JAL': ['label'],
        'JALR': ['rd', 'rs'],
        'JR': ['rs'],
        'LB': ['rt', 'imm', 'rs'],
        'LBU': ['rt', 'imm', 'rs'],
        'LH': ['rt', 'imm', 'rs'],
        'LHU': ['rt', 'imm', 'rs'],
        'LUI': ['rt', 'imm'],
        'LW': ['rt', 'imm', 'rs'],
        'LWC1': ['rt', 'imm', 'rs'],
        'MFHI': ['rd'],
        'MFLO': ['rd'],
        'MTHI': ['rs'],
        'MTLO': ['rs'],
        'MULT': ['rs', 'rt'],
        'MULTU': ['rs', 'rt'],
        'NOR': ['rd', 'rs', 'rt'],
        'OR': ['rd', 'rs', 'rt'],
        'ORI': ['rt', 'rs', 'imm'],
        'SB': ['rt', 'imm', 'rs'],
        'SH': ['rt', 'imm', 'rs'],
        'SLL': ['rd', 'rt', 'SA'],
        'SLLV': ['rd', 'rt', 'rs'],
        'SLT': ['rd', 'rs', 'rt'],
        'SLTI': ['rt', 'rs', 'imm'],
        'SLTIU': ['rt', 'rs', 'imm'],
        'SLTU': ['rd', 'rs', 'rt'],
        'SRA': ['rd', 'rt', 'SA'],
        'SRAV': ['rd', 'rt', 'rs'],
        'SRL': ['rd', 'rt', 'SA'],
        'SRLV': ['rd', 'rt', 'rs'],
        'SUB': ['rd', 'rs', 'rt'],
        'SUBU': ['rd', 'rs', 'rt'],
        'SW': ['rt', 'imm', 'rs'],
        'SWC1': ['rt', 'imm', 'rs'],
        'SYSCALL': [],
        'XOR': ['rd', 'rs', 'rt'],
        'XORI': ['rt', 'rs', 'imm'],
        '.2BYTE': ['imm'],
        '.4BYTE': ['imm'],
        '.8BYTE': ['imm'],
        '.ASCII': ['str'],
        '.ASCIIZ': ['str'],
        '.BYTE': ['imm'],
        '.DWORD': ['imm'],
        '.HALF': ['imm'],
        '.SPACE': ['imm'],
        '.WORD': ['imm']
    };
    const J_set = [
        'J', 'JAL'
    ];
    const DATA_set = ['.2BYTE', '.4BYTE', '.8BYTE', '.ASCII', '.ASCIIZ', '.BYTE',
        '.DWORD', '.HALF', '.SPACE', '.WORD'];
    var OP_NAME = {};
    for (var opname in OP_CODE) {
        OP_NAME[OP_CODE[opname]] = opname;
    }
    operator.getName = (op_num) => OP_NAME[op_num];
    operator.getCode = (op_name) => OP_CODE[op_name];
    operator.getType = (op_name) => {
        if (R_set.indexOf(op_name) >= 0)
            return 'R';
        if (I_set.indexOf(op_name) >= 0)
            return 'I';
        if (J_set.indexOf(op_name) >= 0)
            return 'J';
        if (DATA_set.indexOf(op_name) >= 0)
            return 'DATA';
    };
    operator.getTemplate = (op_name) => INST_TEMPLATE[op_name];
    operator.SPECIAL_RT = {
        'bgez': 1, 'bgezal': 17, 'bltz': 0, 'bltzal': 16
    };
    operator.IMM_LEN = { 'R': 5, 'I': 16, 'J': 26 };
})(operator || (operator = {}));
exports.operator = operator;
const DATA_SIZE = {
    '.2BYTE': 2,
    '.4BYTE': 4,
    '.8BYTE': 8,
    '.ASCII': 1,
    '.ASCIIZ': 1,
    '.BYTE': 1,
    '.DWORD': 8,
    '.HALF': 2,
    '.SPACE': 1,
    '.WORD': 4
};
var register;
(function (register) {
    const REG_NAMES = [
        '$zero', '$at', '$v0', '$v1', '$a0', '$a1', '$a2', '$a3', '$t0', '$t1', '$t2',
        '$t3', '$t4', '$t5', '$t6', '$t7', '$s0', '$s1', '$s2', '$s3', '$s4', '$s5',
        '$s6', '$s7', '$t8', '$t9', '$k0', '$k1', '$gp', '$sp', '$fp', '$ra',
        '$0', '$1', '$2', '$3', '$4', '$5', '$6', '$7', '$8', '$9', '$10', '$11',
        '$12', '$13', '$14', '$15', '$16', '$17', '$18', '$19', '$20', '$21', '$22',
        '$23', '$24', '$25', '$26', '$27', '$28', '$29', '$30', '$31'
    ];
    register.getName = (reg_num) => REG_NAMES[reg_num];
    register.getNum = (reg_name) => (REG_NAMES.indexOf(reg_name) % 32);
})(register || (register = {}));
exports.register = register;
;
