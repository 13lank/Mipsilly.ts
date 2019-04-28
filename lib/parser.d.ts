interface Instruction {
    optr: string;
    opnd: string[];
    addr: number;
}
declare function parseLine(str: string, addr: number): ({
    inst: Instruction;
    lbl: string;
});
declare function parseText(text: string): {
    inst_list: Instruction[];
    lbl_map: {
        [key: string]: number;
    };
};
export { Instruction, parseText, parseLine };
