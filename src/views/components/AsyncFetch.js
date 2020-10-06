import axios from "../../axios";
import auth from "../../auth";


const AsyncFetch = (query, callback) => {
    const q = {
        query: query
    };
    axios.post('graphql', JSON.stringify(q), {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + auth.getSession().token
        }
    }).then(res => {
        if (typeof(res.data.errors) == 'undefined'){
            callback(res);
        }else{
            console.log(res)
            // auth.logout();
            // window.location.href = '/';
        }
    }).catch(err => {
        console.log(err);
        if (err.response.data.errors) {
            auth.logout();
            window.location.href = '/';
        } else {
            console.log(err);
        }
    });
};

export default AsyncFetch