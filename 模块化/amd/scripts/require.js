let require, define;
(function () {
    const variables = {};
    const globalDefQueue = [];
    let module = {};
    function hasAlldependencies(dependencies) {
        let hasValue = true
        dependencies.forEach(depd => {
            if (!variables.hasOwnProperty(depd)) {
                hasValue = false
            }
        })
        return hasValue
    }
    function implementCallback() {
        if (!globalDefQueue.length) return;
        globalDefQueue.forEach(({ name, deps, callback }, index) => {
            if (!hasAlldependencies(deps)) return;
            const returnValue = callback(...deps.map(item => variables[item]));
            if (name) {
                variables[name] = returnValue;
            }
            globalDefQueue.splice(index, 1);
            implementCallback();
        });
    }
    function loadScript(src, model, callback) {
        const script = document.createElement('script');
        const head = document.getElementsByTagName('head')[0];
        script.src = src;
        script.type = "text/javascript";
        script.charset = 'utf-8';
        script.setAttribute('data-requiremodule', model);
        head.appendChild(script);
        script.addEventListener('load', function (event) {
            callback.call(this);
            implementCallback();
        });
    }
    function getModule(src) {
        return src.replace('./', '');
    }
    function getFilePath(fileName) {
        return fileName.replace('.', 'scripts') + '.js';
    }
    require = define = function (name, deps, callback) {
        if (typeof name !== 'string') {
            callback = deps;
            deps = name;
            name = null;
        }
        if (!Array.isArray(deps)) {
            callback = deps;
            deps = [];
        }
        if (!deps.length) {
            console.log(module)
            module = {
                value: callback()
            }
            return;
        }
        module = { deps: deps.map(item => item.replace('./', '')), callback: callback ? callback : function () { } };
        globalDefQueue.push(module);
        deps.forEach(item => {
            loadScript(getFilePath(item), getModule(item), function () {
                const moduleName = name ? name : this.getAttribute('data-requiremodule');;
                if (module.hasOwnProperty('value')) {
                    variables[moduleName] = module.value;
                } else {
                    module.name = moduleName;
                }
            });
        });
    }
    require(['./main']);
})();