import MyHistory from './MyHistory';

class HashHistory extends MyHistory {
    _push(hash) {
        history.pushState({},'','/#'+hash);
        // window.location.hash = hash;
    }

    updateLocation() {
        this.location = {
            // hash:window.location.hash,
            pathname: window.location.hash.slice(1) || '/',
            search: window.location.search
        }
    }
}

export default function createHashHistory() {
    const history = new HashHistory();
    window.addEventListener('popstate', () => {
        history.updateLocation();
        history._listen();
    });
    return history;
};