import { Rule } from 'antd/es/form';

export type TFormRules<F extends object = any> = Partial<Record<F extends object ? keyof F : string, Rule[]>>;
