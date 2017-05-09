declare var java: any;
declare var CACurrentMediaTime: any;
declare var __startCPUProfiler: any;
declare var __stopCPUProfiler: any;

export let ENABLE_PROFILING = true;

let anyGlobal = <any>global;

export function time(): number {
    if (!ENABLE_PROFILING) {
        return;
    }

    if (anyGlobal.android) {
        return java.lang.System.nanoTime() / 1000000; // 1 ms = 1000000 ns
    } else {
        return CACurrentMediaTime() * 1000;
    }
}

interface TimerInfo {
    totalTime: number;
    lastTime?: number;
    count: number;
    currentStart: number;
}

let timers = new Map<string, TimerInfo>();

export function start(name: string): void {
    if (!ENABLE_PROFILING) {
        return;
    }

    let info: TimerInfo;
    if (timers.has(name)) {
        info = timers.get(name);
        if (info.currentStart !== 0) {
            throw new Error(`Timer already started: ${name}`);
        }
        info.currentStart = time();
    } else {
        info = {
            totalTime: 0,
            count: 0,
            currentStart: time()
        };
        timers.set(name, info);
    }
}

export function pause(name: string) {
    if (!ENABLE_PROFILING) {
        return;
    }

    let info = pauseInternal(name);
    console.log(`---- [${name}] PAUSE last: ${info.lastTime} total: ${info.totalTime} count: ${info.count}`);
}

export function stop(name: string) {
    if (!ENABLE_PROFILING) {
        return;
    }

    let info = pauseInternal(name);
    console.log(`---- [${name}] STOP total: ${info.totalTime} count:${info.count}`);

    timers.delete(name);
}

function pauseInternal(name: string): TimerInfo {
    let info = timers.get(name);
    if (!info) {
        throw new Error(`No timer started: ${name}`);
    }

    info.lastTime = Math.round(time() - info.currentStart);
    info.totalTime += info.lastTime;
    info.count++;
    info.currentStart = 0;

    return info;
}

export function startCPUProfile(name: string) {
    if (!ENABLE_PROFILING) {
        return;
    }

    if (anyGlobal.android) {
        __startCPUProfiler(name);
    }
}

export function stopCPUProfile(name: string) {
    if (!ENABLE_PROFILING) {
        return;
    }

    if (anyGlobal.android) {
        __stopCPUProfiler(name);
    }
}


let profileNames: string[] = [];

export function profileMethod(name?: string): (target, key, descriptor) => void {
    return (target, key, descriptor) => {
        // save a reference to the original method this way we keep the values currently in the
        // descriptor and don't overwrite what another decorator might have done to the descriptor.
        if (descriptor === undefined) {
            descriptor = Object.getOwnPropertyDescriptor(target, key);
        }
        var originalMethod = descriptor.value;

        if (!name) {
            name = key;
        }

        profileNames.push(name);

        //editing the descriptor/value parameter
        descriptor.value = function () {
            // console.log("before:" + name);

            start(name);

            var result = originalMethod.apply(this, arguments);

            pause(name)

            // console.log("after:" + name);
            return result;
        };

        // return edited descriptor as opposed to overwriting the descriptor
        return descriptor;
    }
}


export function dumpProfiles() {
    profileNames.forEach(function (name) {
        var info = timers.get(name);
        if (info) {
            console.log("---- [" + name + "] STOP total: " + info.totalTime + " count:" + info.count);
        }
        else {
            console.log("---- [" + name + "] Never called");
        }
    });
}