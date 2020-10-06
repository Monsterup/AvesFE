import axios from './axios';

class Auth {
    isAuth() {
        return !!sessionStorage.getItem('avesbox_session')
    }

    setSession(userId, name, token, company, photo, type, callback) {
        let sessionData = {userId, name, type, token, company, photo};
        sessionStorage.setItem('avesbox_session', JSON.stringify(sessionData));
        const res = sessionStorage.getItem('avesbox_session');
        callback(res);
    }

    getSession() {
        return JSON.parse(sessionStorage.getItem('avesbox_session'));
    }

    logout() {
        sessionStorage.removeItem('avesbox_session')
    }
}

export default new Auth();