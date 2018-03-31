const {getOptions} = require('loader-utils');
const path = require('path');
const fs = require('fs');
const defaultOptions = {
    placeholder: '{{__content__}}',
    decorator: 'layout'
};
module.exports = function (source) {
    let options = {...defaultOptions, ...getOptions(this)};
    let {placeholder, decorator, layout} = options;
    let callback = this.async()
    const reg = new RegExp(`@${decorator}\\((.+?)\\)`);
    const result = source.match(reg);
    if(result){
        source = source.replace(reg,'');
        render(path.resolve(this.context,result[1]),placeholder,source,callback);
    }else {
        render(layout,placeholder,source,callback);
    }

};
function render(layout,placeholder,source,callback) {
    fs.readFile(layout,'utf8',(err,html)=>{
        html = html.replace(placeholder,source);
        callback(err,`module.exports = ${JSON.stringify(html)}`);
    });
}