import { ObservableErrorClass } from "./observable";
import { defaultSpy, IDefaultSpy } from "./helper/helper";


describe("ObservableErrorClass", () => {
    let r: IDefaultSpy;
    beforeEach(() => r = defaultSpy());
    
    it("should throw error if there is no listener", () => {
        const oe = new ObservableErrorClass();
        expect(() => oe.next(new Error("error"))).toThrow();
    });
    it("should pass error if it has listener", () => {
        const oe = new ObservableErrorClass();
        oe.report(r.f);
        oe.next(new Error("error"));
        expect(r.f).toHaveBeenCalledTimes(1);
    });
    
});