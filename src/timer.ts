import { listener, state, ReporterClass, toStateHolder, Atom, Reporter, State, IStateHolder } from "soboku";
import { ISObservable } from "../index.d";
import { SObservable } from "./observable";


abstract class TimerObservable extends SObservable<boolean, number, State<boolean>> {
    protected readonly cb = () => this.output.next(Date.now());
    protected readonly ms: IStateHolder<number>;
    protected timer: NodeJS.Timer;
    protected isRunning = false;

    constructor(ms: Atom<number>) {
        super(state(false));
        const _ms = this.ms = toStateHolder(ms);
        if (_ms instanceof ReporterClass)
            _ms.report(listener(this.msChanged, this));
    }

    private msChanged(ms: number) {
        if (this.isRunning) {
            this.onInput(false);
            this.onInput(true, ms);
        }
    }

    protected onInput(trigger: boolean, ms?: number): void {
        this.fire(trigger, ms || this.ms.s());
        this.isRunning = trigger;
    }

    protected onReset() {
        this.input.next(false);
    }

    protected abstract fire(trigger: boolean, ms: number): void;

}

class IntervalObservable extends TimerObservable {

    protected fire(trigger: boolean, ms: number) {
        if (trigger === false) {
            clearInterval(this.timer);
        } else if (this.isRunning === false) {
            this.timer = setInterval(this.cb, ms);
        }
    }
    
}

class TimeoutObservable extends TimerObservable {

    protected fire(trigger: boolean, ms: number) {
        clearTimeout(this.timer);
        if (trigger) {
            this.timer = setTimeout(this.cb, ms);
        }
    }

}


export function interval(ms: Atom<number>): ISObservable<boolean, number, State<boolean>> {
    return new IntervalObservable(ms);
}

export function timeout(ms: Atom<number>): ISObservable<boolean, number, State<boolean>> {
    return new TimeoutObservable(ms);
}
