import MyHistory from './MyHistory';
class BrowserHistory extends MyHistory{
    _push(hash){
        history.pushState({},'',hash);
    }
    updateLocation(){
        this.location = {
            // hash:window.location.hash,
            pathname:window.location.pathname,
            search:window.location.search
        };
    }
}
export default function createHashHistory(){
    const history = new BrowserHistory();
    window.addEventListener('popstate',()=>{
        console.log(99999)
        history.updateLocation();
        history._listen();
    });
    return history;
};