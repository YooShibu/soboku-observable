# soboku-observable

This is javascript package for observable by [soboku](https://github.com/YooShibu/soboku).


~~~ typescript
import { interval } from "soboku-observable"
import { state, gate, editer, trigger, ntrigger } from "soboku"


// -----------------------------------------
// Prepere countdown timer
// -----------------------------------------

function getTimerMessage(isRunning: boolean) {
    return isRunning ? "Start!" : "Done!";
}

const _count = state(3),
      decCount = () => _count.next(_count.s() - 1),
      _isEnd = editer((x: number) => x === 0, [_count]),
      isEnd = trigger(_isEnd);
      isRunning = ntrigger(_isEnd),
      count = gate(isRunning, _count),
      timer = interval(1000),
      timerMessage = editer(getTimerMessage, [timer.input]);
      
count.report(console.log);
timerMessage.report(console.log);
timer.output.report(decCount);
isEnd.report(end => timer.input.next(!end));


// -----------------------------------------
// Start countdown timer
// -----------------------------------------

timer.input.next(true);

// Start!
// 2
// 1
// Done!
~~~


## API

#### `interval(ms: Atom<number>): ISObservable<State<boolean>, number>`
~~~ typescript
import { interval } from "soboku"

function showLocaleTime(now: number): void {
    console.log(new Date(now).toLocaleTimeString());
}

const timer = interval(1000);
interval.output.report(showLocaleTime);

timer.input.next(true);
// ...1s later
// 21:44:58
// 21:44:59
// ... forever
~~~

#### `timeout(ms: Atom<number>): ISObservable<State<boolean>, number>`
~~~ typescript
import { timeout } from "soboku"

function done() {
    console.log("done");
}

const timer1 = timeout(1000);
const timer2 = timeout(500);
timer1.output.report(done);
// .5sec later. Restart timer1
timer2.output.report(() => timer1.input.next(true));

timer1.input.next(true);
timer2.input.next(true);

// console 1.5sec later
// done
~~~

#### `sequenceEqual<T>(sequence: T[] | ISArray<T>, compareFn?: (x: T, y: T) => boolean): ISObservalbe<Reporter<T>, true>`
~~~ typescript
import { sequenceEqual } from "soboku"

const isOKinputed = sequenceEqual(["O", "K"]);
sequenceEqual.output.report(console.log);

sequenceEqual.input.next("N");
sequenceEqual.input.next("O");
sequenceEqual.input.next("K");
// console
// true
~~~


### Class

#### `SObservable<I, O, T extends Reporter<I>>`
This is abstract class.
##### member
- readonly input: T
- readonly error: Reporter\<Error>
- readonly output: Reporter\<O>
- readonly reset: Reporter\<true>
##### constructer
- constructer(input: T);
##### methods
- protected abstract onInput(val: I): void;
- protected abstract onReset(): void;