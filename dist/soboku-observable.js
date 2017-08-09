'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var soboku = require('soboku');

function __extends(d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var SObservable = (function () {
    function SObservable(input) {
        this.output = soboku.reporter();
        this.error = new ObservableErrorClass();
        this.reset = soboku.reporter();
        this.input = input;
        input.report(soboku.listener(this.onInput, this));
        this.reset.report(soboku.listener(this.onReset, this));
    }
    return SObservable;
}());
var ObservableErrorClass = (function (_super) {
    __extends(ObservableErrorClass, _super);
    function ObservableErrorClass() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ObservableErrorClass.prototype.next = function (err) {
        if (this.listenerCount() === 0) {
            var unhandledError = new Error("Unhandled observable error: " + err.name + ": " + err.message);
            unhandledError.name = "UnhandledObservableErrorWarning";
            throw unhandledError;
        }
        return _super.prototype.next.call(this, err);
    };
    return ObservableErrorClass;
}(soboku.ReporterClass));

function isEqual(x, y) {
    return x === y;
}
var SequenceEqualClass = (function (_super) {
    __extends(SequenceEqualClass, _super);
    function SequenceEqualClass(sequence, compare) {
        if (compare === void 0) { compare = isEqual; }
        var _this = _super.call(this, soboku.reporter()) || this;
        _this.i = 0;
        _this.compare = compare;
        _this.sequence = soboku.toStateHolder(sequence);
        return _this;
    }
    SequenceEqualClass.prototype.onInput = function (val) {
        var sequence = this.sequence.s();
        if (this.compare(sequence[this.i], val) === false) {
            this.i = 0;
            return;
        }
        if (++this.i === sequence.length) {
            this.i = 0;
            this.output.next(true);
        }
    };
    SequenceEqualClass.prototype.onReset = function () {
        this.i = 0;
    };
    return SequenceEqualClass;
}(SObservable));
function sequenceEqual(sequence, compareFunc) {
    return new SequenceEqualClass(sequence, compareFunc);
}

var TimerObservable = (function (_super) {
    __extends(TimerObservable, _super);
    function TimerObservable(ms) {
        var _this = _super.call(this, soboku.state(false)) || this;
        _this.cb = function () { return _this.output.next(Date.now()); };
        _this.isRunning = false;
        var _ms = _this.ms = soboku.toStateHolder(ms);
        if (_ms instanceof soboku.ReporterClass)
            _ms.report(soboku.listener(_this.msChanged, _this));
        return _this;
    }
    TimerObservable.prototype.msChanged = function (ms) {
        if (this.isRunning) {
            this.onInput(false);
            this.onInput(true, ms);
        }
    };
    TimerObservable.prototype.onInput = function (trigger, ms) {
        this.fire(trigger, ms || this.ms.s());
        this.isRunning = trigger;
    };
    TimerObservable.prototype.onReset = function () {
        this.input.next(false);
    };
    return TimerObservable;
}(SObservable));
var IntervalObservable = (function (_super) {
    __extends(IntervalObservable, _super);
    function IntervalObservable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    IntervalObservable.prototype.fire = function (trigger, ms) {
        if (trigger === false) {
            clearInterval(this.timer);
        }
        else if (this.isRunning === false) {
            this.timer = setInterval(this.cb, ms);
        }
    };
    return IntervalObservable;
}(TimerObservable));
var TimeoutObservable = (function (_super) {
    __extends(TimeoutObservable, _super);
    function TimeoutObservable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TimeoutObservable.prototype.fire = function (trigger, ms) {
        clearTimeout(this.timer);
        if (trigger) {
            this.timer = setTimeout(this.cb, ms);
        }
    };
    return TimeoutObservable;
}(TimerObservable));
function interval(ms) {
    return new IntervalObservable(ms);
}
function timeout(ms) {
    return new TimeoutObservable(ms);
}

exports.SObservable = SObservable;
exports.sequenceEqual = sequenceEqual;
exports.interval = interval;
exports.timeout = timeout;
//# sourceMappingURL=soboku-observable.js.map
