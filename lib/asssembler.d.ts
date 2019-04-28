import { Instruction } from './parser';
export declare function instToBin(inst: Instruction, lbl_map: {
    [key: string]: number;
}): number;
export declare var instsToBin: (data: {
    inst_list: Instruction[];
    lbl_map: {
        [key: string]: number;
    };
}) => string[];
export {};
