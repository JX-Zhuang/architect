let confirm;
export default class MyHistory {
    constructor() {
        this.updateLocation();
    }

    go() {
        return history.go(...arguments)
    }

    goBack() {
        return history.back(...arguments)
    }

    goForward() {
        return history.forward(...arguments);
    }

    push() {
        if (this.prompt(...arguments)) {
            this._push(...arguments);
            this.updateLocation();
            this._listen();
            confirm = null;
        }
    }

    listen(fun) {
        this._listen = fun;
    }

    createHref(path) {
        if (typeof path === 'string') return path;
        return path.pathname;
    }

    block(message) {
        confirm = message;
    }

    prompt(pathname) {
        if (!confirm) return true;
        const location = Object.assign(this.location,{pathname});
        const result = typeof confirm === 'function' ? confirm(location) : confirm;
        return window.confirm(result);
    }
}

// var history = {
//     action: '',
//     block: '',   //fun
//     createHref: '',//fun
//     go: '',//fun
//     goBack: '',//fun
//     goForward: '',//fun
//     length: '',
//     listen: '',//fun
//     location: {
//         hash: '',    //window.location.hash
//         key: "um5ide",//暂时不用
//         pathname: "",//window.location.pathname
//         search: "查询字符串",//window.location.search
//         state: undefined
//     },
//     push: '',//fun
//     replace: ''//fun
// }