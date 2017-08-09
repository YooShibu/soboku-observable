import { Atom, IReporter, ISArray, Reporter, State } from "soboku";


export abstract class SObservable<I, O, T extends Reporter<I>> {
    readonly input: T;
    readonly error: Reporter<Error>;
    readonly output: Reporter<O>;
    readonly reset: Reporter<true>;

    constructor(input: T);
    
    protected abstract onInput(val: I): void;
    protected abstract onReset(): void;
}

export interface ISObservable<I, O, T extends Reporter<I>> {
    readonly input: T;
    readonly error: IReporter<Error>;
    readonly output: IReporter<O>;
    readonly reset: Reporter<true>;
}

export function interval(ms: Atom<number>): ISObservable<boolean, number, State<boolean>>;
export function timeout(ms: Atom<number>): ISObservable<boolean, number, State<boolean>>;
export function sequenceEqual<T>(sequence: T[]  | ISArray<T>, compareFn?: (x: T, y: T) => boolean): ISObservable<T, true, Reporter<T>>;