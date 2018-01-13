# Promise
>实现一个符合 Promise/A+ 规范的 MyPromise，并实现 resolve、reject、all、race、defer、deferred等静态方法。

### MyPromise 
1. 作用：创建 `MyPromise` 实例
2. MyPromise接收一个回掉函数 `executor`
3. MyPromise状态
    * pending
        * 可以转换成 fulfilled 或 rejected
    * fulfilled
        * 不可改变成其他状态
    * rejected
        * 不可改变成其他状态
4. `onFulfilledCallbacks` 和 `onRejectedCallbacks`
    * 两个数组，数组每一项是一个函数。分别接收`then`里面的第一个参数和第二个参数。
    * 状态是 `pending` 的回掉函数。
5. resolve
    * `promise`的状态是`fulfilled`异常是的处理函数
    * 接收 `value` 参数
        * 如果是`promise`，执行`then`。
        * 如果不是`promise`，把`value`做为参数传给`onFulfilledCallbacks`里的每个函数。
6. reject
    * `promise`的状态是`rejected`异常是的处理函数
    * 接收 `reason` 参数，把`reason`做为参数传给`onRejectedCallbacks`里的每个函数。
7. 执行 `executor`，如果有异常，抛给`reject`
8. 因为`Promise`是在同步代码执行完成后再执行，所以要把`Mypromise`的执行方法`resolve`和`reject`放在异步队列里
```javascript
function MyPromise(executor) {
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
            if (self.status === 'pending') {
                self.value = value;
                self.status = 'fulfilled';
                self.onFulfilledCallbacks.forEach(item => item(value));
            }
        }
    
        function reject(reason) {
            if (self.status === 'pending') {
                self.reason = reason;
                self.status = 'rejected';
                self.onRejectedCallbacks.forEach(item => item(reason));
            }
        }

    try {
        executor(resolve, reject);
    } catch (e) {
        reject(e);
    }
}

```
### MyPromise.prototype.then
1. 作用：接收两个函数参数，第一个函数的参数是 `resolve`传入的参数，第二个参数是 `reject`传入的参数。
2. `onFulfilled`
    * `MyPromise` 成功时执行的方法
    * `resolve` 的参数会作为`value`传给 `onFulfilled`
3. `onRejected`
    * `MyPromise` 失败时执行的方法
    * `reject` 的参数会作为`value`传给 `onRejected`
4. 返回一个 `MyPromise` 实例 `newPromise`，方便链式调用
5. 对三种状态分别处理
    * 每个状态中创建 `newPromise`
    * `fulfilled`
        * 直接执行 `onFulfilled`，返回值`x`
        * 把`newPromise`、`x`以及`newPromise`里的`resolve`、`reject`做为参数传给 `resolutionPromise`
        * 把 MyPromise 的参数放在异步队列里
    * `rejected`
        * 直接执行 `onRejected`，返回值`x`
        * 把`newPromise`、`x`以及`newPromise`里的`resolve`、`reject`做为参数传给 `resolutionPromise`
        * 把 MyPromise 的参数放在异步队列里
    * `pending`
        * 状态待定，把`fulfilled`和`rejected`里的异步函数分别加到 `onFulfilledCallbacks` 和 `onRejectedCallbacks`的最后一位
6. `resolutionPromise` 后面细说
7. 用`catch`捕获异常，执行 `reject`

```javascript
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

```
### MyPromise.prototype.catch
1. 作用：捕获异常
2. 返回 `MyPromise`
```javascript
MyPromise.prototype.catch = function (onRejected) {
    return this.then(undefined, onRejected);
};
```
### The Promise Resolution Procedure
1. Promise解析过程，是以一个 `promise`、一个值 `x`及`resolve`, `reject`做为参数的抽象过程
2. `promise` 等于 `x`，`reject` 抛出异常 `new TypeError('循环引用')`
3. `x`如果不是对象（不包括 `null`）或者函数，执行 `resolve(x)`
4. 获取 `x.then` 赋值给 `then`
    * `then` 如果是 `function`
        * 把 `x`做为 `this` 调用`then`，第一个参数是 `resolvePromise`，第二个参数是 `rejectPromise`
        * `resolvePromise`和 `rejectPromise`只有第一次调用有效
        * `resolvePromise`参数为 `y`，执行 `resolutionPromise(promise, y, resolve, reject)`
        * `rejectPromise`参数为 `r`，执行 `reject(r)`
    * `then` 如果不是 `function`
        * 执行 `resolve(x)`
5. 用捕获上一步的异常
    * 执行 `reject(e)`
    * 如果执行过 `resolvePromise`或 `rejectPromise`，忽略
       
```javascript
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
```
### MyPromise 静态方法
#### MyPromise.all
* 作用：http://liubin.org/promises-book/#ch2-promise-all
```javascript
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
```
#### MyPromise.race
* 作用：http://liubin.org/promises-book/#ch2-promise-race
```javascript
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
```
#### MyPromise.resolve
* 作用：http://liubin.org/promises-book/#ch2-promise-resolve
```javascript
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
```
#### MyPromise.reject
* 作用：http://liubin.org/promises-book/#ch2-promise-reject
```javascript
MyPromise.reject = function (e) {
    return new MyPromise(function (resolve, reject) {
        reject(e);
    })
};
```
### test
* npm i -g promises-aplus-tests
* promises-aplus-tests Promise.js
###### 参考资料
* https://segmentfault.com/a/1190000002452115
* https://promisesaplus.com/
* http://liubin.org/promises-book/