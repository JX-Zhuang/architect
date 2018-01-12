/**
 * Promise：
 *      Promise 构造函数
 *          接收一个函数类型的参数
 *          状态：1、pending:转化成fulfilled或rejected
 *               2、fulfilled:不能转变，必须有一个值且不能改变
 *               3、rejected:不能转变，必须有一个原因且不能改变
 *     Promise.prototype.then
 *          onFulfilled 和 onRejected 必须是函数
 *          then 要返回 promise
 *          onFulfilled or onRejected must not be called until the execution context stack contains only platform code.
 *          onFulfilled or onRejected的代码在异步队列里，要在执行完所有同步代码后再执行。
 *
 */
function MyPromise(executor) {
    //实例化时，要调用resolve，resolve里的this不一定指向实例，所以要缓存this
    if (typeof executor !== 'function') {
        throw new TypeError('Promise resolver ' + executor + ' is not a function');
    }
    let self = this;
    this.status = 'pending';
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    function resolve(value) {
        if (value instanceof MyPromise) {
            return value.then(resolve, reject);
        }
        setTimeout(function () {
            if (self.status === 'pending') {
                self.value = value;
                self.status = 'fulfilled';
                self.onFulfilledCallbacks.forEach(item => item(value));
            }
        });
    }

    function reject(reason) {
        setTimeout(function () {
            if (self.status === 'pending') {
                self.reason = reason;
                self.status = 'rejected';
                self.onRejectedCallbacks.forEach(item => item(reason));
            }
        });
    }

    try {
        executor(resolve, reject);
    } catch (e) {
        reject(e);
    }
}

MyPromise.prototype.then = function (onFulfilled, onRejected) {
    let self = this;
    typeof onFulfilled !== 'function' && (onFulfilled = function (value) {
        return value;
    });
    typeof onRejected !== 'function' && (onRejected = function (reason) {
        throw reason;
    });
    let newPromise;
    /**
     *  分别处理实例的三种状态
     */
    if (self.status === 'fulfilled') {
        newPromise = new MyPromise(function (resolve, reject) {
            setTimeout(function () {
                try {
                    let x = onFulfilled(self.value);
                    resolutionPromise(newPromise, x, resolve, reject);
                } catch (e) {
                    reject(e);
                }
            });
        });
    }
    if (self.status === 'rejected') {
        newPromise = new MyPromise(function (resolve, reject) {
            setTimeout(function () {
                try {
                    let x = onRejected(self.reason);
                    resolutionPromise(newPromise, x, resolve, reject);
                } catch (e) {
                    reject(e);
                }
            });
        });
    }
    if (self.status === 'pending') {
        newPromise = new MyPromise(function (resolve, reject) {
            self.onFulfilledCallbacks.push(function (value) {
                setTimeout(function () {
                    try {
                        let x = onFulfilled(value);
                        resolutionPromise(newPromise, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                });
            });
            self.onRejectedCallbacks.push(function (reason) {
                setTimeout(function () {
                    try {
                        let x = onRejected(reason);
                        resolutionPromise(newPromise, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                });
            });
        });
    }
    return newPromise;
};
MyPromise.prototype.catch = function (onRejected) {
    return this.then(undefined, onRejected);
};

/**
 * The Promise Resolution Procedure
 */
function resolutionPromise(promise, x, resolve, reject) {
    if (promise === x) {
        reject(new TypeError('循环引用'));
    }
    let then, called;
    if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
        try {
            then = x.then;
            if (typeof then === 'function') {
                then.call(x, function (y) {
                    if (called)
                        return;
                    called = true;
                    resolutionPromise(promise, y, resolve, reject);
                }, function (r) {
                    if (called)
                        return;
                    called = true;
                    reject(r);
                })
            } else {
                resolve(x);
            }
        } catch (e) {
            if (called)
                return;
            reject(e);
        }
    } else {
        resolve(x);
    }
}
MyPromise.resolve = function (value) {
    if (value instanceof MyPromise) {
        return value;
    }
    return new MyPromise(function (resolve, reject) {
        if (typeof value !== null && typeof value === 'object' && typeof value.then === 'function') {
            value.then();
        } else {
            resolve(value);
        }
    })
};
MyPromise.reject = function (e) {
    return new MyPromise(function (resolve, reject) {
        reject(e);
    })
};
MyPromise.all = function (promises) {
    let called = false;
    return new MyPromise(function (resolve, reject) {
        let newArr = [], count = 0;
        for (let i = 0; i < promises.length; i++) {
            let item = promises[i];
            if (!(item instanceof MyPromise)) {
                item = MyPromise.resolve(item);
            }
            item.then(function (data) {
                if (!called) {
                    newArr[i] = data;
                    if (i == count) {
                        resolve(newArr);
                        count++;
                    }
                }
            }, function (e) {
                if (!called) {
                    reject(e);
                    called = true;
                }
            });
        }
    });
};
MyPromise.race = function (promises) {
    return new MyPromise(function (resolve, reject) {
        let called = false;
        for (let i = 0; i < promises.length; i++) {
            let item = promises[i];
            if (!(item instanceof MyPromise)) {
                item = MyPromise.resolve(item);
            }
            item.then(function (data) {
                if (!called) {
                    resolve(data);
                    called = true;
                }
            }, function (e) {
                if (!called) {
                    reject(e);
                    called = true;
                }
            });
        }
    })
};
MyPromise.defer = MyPromise.deferred = function () {
    let defer = {};
    defer.promise = new MyPromise(function (resolve, reject) {
        defer.resolve = resolve;
        defer.reject = reject;
    });
    return defer;
};
try {
    module.exports = MyPromise
} catch (e) {
}
// module.exports = MyPromise;