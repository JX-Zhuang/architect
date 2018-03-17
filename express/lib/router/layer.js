class Layer{
    constructor(path,options,handle){
        this.path = path;
        this.handle = handle;
    }
    handle_request(req,res,next){
        const fn = this.handle;
        fn(req,res,next);
    }
    match(path){
        if(path==this.path)
            return true;
    }
}

module.exports = Layer;