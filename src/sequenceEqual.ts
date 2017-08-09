import { reporter, ReporterClass, toStateHolder, Reporter, ISArray, IStateHolder } from "soboku";
import { ISObservable } from "../index.d";
import { SObservable } from "./observable";


function isEqual(x: any, y: any): boolean {
    return x === y;
}

class SequenceEqualClass<T> extends SObservable<T, true, Reporter<T>> {
    private readonly compare: (x: any, y: any) => boolean;
    private readonly sequence: IStateHolder<T[]>;
    private i = 0;

    constructor(sequence: T[] | ISArray<T>, compare = isEqual) {
        super(reporter<T>());
        this.compare = compare;
        this.sequence =  toStateHolder(sequence);
    }

    protected onInput(val: T): void {
        const sequence = this.sequence.s();
        if (this.compare(sequence[this.i], val) === false) {
            this.i = 0;
            return;
        }
        if (++this.i === sequence.length) {
            this.i = 0;
            this.output.next(true);
        }
    }

    protected onReset() {
        this.i = 0;
    }
    
}

export function sequenceEqual<T>(sequence: T[] | ISArray<T>, compareFunc?: (x: T, y: T) => boolean): ISObservable<T, true, Reporter<T>> {
    return new SequenceEqualClass(sequence, compareFunc);
}
