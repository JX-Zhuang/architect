module.exports = function (source) {
    function getStyle(style) {
        const e = document.createElement('style');
        e.innerHTML = style;
        document.head.appendChild(e);
    }
    return `const e = document.createElement('style');
        e.innerHTML = ${JSON.stringify(source)};
        document.head.appendChild(e);`;
};