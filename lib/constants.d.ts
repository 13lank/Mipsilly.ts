declare namespace operator {
    var getName: (op_num: number) => string;
    var getCode: (op_name: string) => number;
    var getType: (op_name: string) => "J" | "R" | "I" | "DATA" | undefined;
    var getTemplate: (op_name: string) => string[];
    const SPECIAL_RT: {
        [key: string]: number;
    };
    const IMM_LEN: {
        [key: string]: number;
    };
}
declare namespace register {
    var getName: (reg_num: number) => string;
    var getNum: (reg_name: string) => number;
}
export { register, operator };
