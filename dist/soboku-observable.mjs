import { ReporterClass, listener, reporter, state, toStateHolder } from 'soboku';

class SObservable {
    constructor(input) {
        this.output = reporter();
        this.error = new ObservableErrorClass();
        this.reset = reporter();
        this.input = input;
        input.report(listener(this.onInput, this));
        this.reset.report(listener(this.onReset, this));
    }
}
class ObservableErrorClass extends ReporterClass {
    next(err) {
        if (this.listenerCount() === 0) {
            const unhandledError = new Error(`Unhandled observable error: ${err.name}: ${err.message}`);
            unhandledError.name = "UnhandledObservableErrorWarning";
            throw unhandledError;
        }
        return super.next(err);
    }
}

function isEqual(x, y) {
    return x === y;
}
class SequenceEqualClass extends SObservable {
    constructor(sequence, compare = isEqual) {
        super(reporter());
        this.i = 0;
        this.compare = compare;
        this.sequence = toStateHolder(sequence);
    }
    onInput(val) {
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
    onReset() {
        this.i = 0;
    }
}
function sequenceEqual(sequence, compareFunc) {
    return new SequenceEqualClass(sequence, compareFunc);
}

class TimerObservable extends SObservable {
    constructor(ms) {
        super(state(false));
        this.cb = () => this.output.next(Date.now());
        this.isRunning = false;
        const _ms = this.ms = toStateHolder(ms);
        if (_ms instanceof ReporterClass)
            _ms.report(listener(this.msChanged, this));
    }
    msChanged(ms) {
        if (this.isRunning) {
            this.onInput(false);
            this.onInput(true, ms);
        }
    }
    onInput(trigger, ms) {
        this.fire(trigger, ms || this.ms.s());
        this.isRunning = trigger;
    }
    onReset() {
        this.input.next(false);
    }
}
class IntervalObservable extends TimerObservable {
    fire(trigger, ms) {
        if (trigger === false) {
            clearInterval(this.timer);
        }
        else if (this.isRunning === false) {
            this.timer = setInterval(this.cb, ms);
        }
    }
}
class TimeoutObservable extends TimerObservable {
    fire(trigger, ms) {
        clearTimeout(this.timer);
        if (trigger) {
            this.timer = setTimeout(this.cb, ms);
        }
    }
}
function interval(ms) {
    return new IntervalObservable(ms);
}
function timeout(ms) {
    return new TimeoutObservable(ms);
}

export { SObservable, sequenceEqual, interval, timeout };
//# sourceMappingURL=soboku-observable.mjs.map
