import { listener, reporter, Reporter, ReporterClass } from "soboku";
import { ISObservable } from "../index.d";


export abstract class SObservable<I, O, T extends Reporter<I>> implements ISObservable<I, O, T> {
    public readonly input: T;
    public readonly output = reporter<O>();
    public readonly error = new ObservableErrorClass();
    public readonly reset = reporter<true>();

    constructor(input: T) {
        this.input = input;
        input.report(listener(this.onInput, this));
        this.reset.report(listener(this.onReset, this));
    }
    
    protected abstract onInput(val: I): void;
    protected abstract onReset(): void;

}

export  class ObservableErrorClass extends ReporterClass<Error> {

    public next(err: Error) {
        if (this.listenerCount() === 0) {
            const unhandledError = new Error(`Unhandled observable error: ${err.name}: ${err.message}`);
            unhandledError.name = "UnhandledObservableErrorWarning";
            throw unhandledError;
        }
        return super.next(err);
    }
    
}