define(['./config'], function (config) {
    console.log(config)
    var utils = {
        request() {
            console.log(config.api);
        }
    };
    return utils;
});