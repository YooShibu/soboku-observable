export interface IDefaultSpy {
    f: () => any;
}

export function spyOnAll<T>(obj: T): T {
    for (let key in obj)
        spyOn(obj, key);
    return obj;
}

export function defaultSpy(): IDefaultSpy {
    return spyOnAll<IDefaultSpy>({ f() {} });
}

export function add(x: number, y: number): number {
    return x + y;
}

export function twice(x: number): number {
    return x * 2;
}
