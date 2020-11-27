import axios from "axios";

// export default axios.create({
//     baseURL: "http://avesbox-2020.glitch.me/",
//     responseType: "json"
// });

export default axios.create({
    baseURL: "http://localhost:8000/",
    responseType: "json"
});