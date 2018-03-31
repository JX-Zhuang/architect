(function(modules) {
    var installedModules = {};
    function __webpack_require__(moduleId) {
        if(installedModules[moduleId]) {
            return installedModules[moduleId].exports;
        }
        var module = installedModules[moduleId] = {
            i: moduleId,
            l: false,
            exports: {}
        };
        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        module.l = true;
        return module.exports;
    }
    __webpack_require__.m = modules;
    __webpack_require__.c = installedModules;
    __webpack_require__.d = function(exports, name, getter) {
        if(!__webpack_require__.o(exports, name)) {
            Object.defineProperty(exports, name, {
                configurable: false,
                enumerable: true,
                get: getter
            });
        }
    };
    __webpack_require__.r = function(exports) {
        Object.defineProperty(exports, '__esModule', { value: true });
    };
    __webpack_require__.n = function(module) {
        var getter = module && module.__esModule ?
            function getDefault() { return module['default']; } :
            function getModuleExports() { return module; };
        __webpack_require__.d(getter, 'a', getter);
        return getter;
    };
    __webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
    __webpack_require__.p = "";
    return __webpack_require__(__webpack_require__.s = "./src/index.js");
})
({

    "./src/index.js":
        (function(module, exports, __webpack_require__) {

            "use strict";
            eval("\n\nvar _ajax = __webpack_require__(/*! libs/ajax */ \"./src/libs/ajax/index.js\");\n\nvar _ajax2 = _interopRequireDefault(_ajax);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nconsole.log(_ajax2.default); // import main from './main';\n// import React from 'react';\n// import ReactDOM from 'react-dom';\n// import Top from '@/top';\n// require('./style/index.css');\n// require('./style/less.less');\n// require('./style/scss.scss');\n// require('./style/public/index.css');\n// require('./style/public/less.less');\n// require('./style/public/scss.scss');\n// console.log(main);\n// let img = new Image();\n// img.src = require('./image/3.jpg');\n// document.body.appendChild(img);\n// class Index extends React.Component{\n//     constructor(){\n//         super();\n//     }\n//     render(){\n//         return <div>\n//             <h1>{main}</h1>\n//             <Top/>\n//         </div>;\n//     }\n// }\n// ReactDOM.render(<Index />,document.getElementById('root'));\n// import ajax from './main';\n\n//# sourceURL=webpack:///./src/index.js?");

        }),

    "./src/libs/ajax/index.js":
        (function(module, exports, __webpack_require__) {

            "use strict";
            eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.default = 'ajax';\n\n//# sourceURL=webpack:///./src/libs/ajax/index.js?");

        })

});