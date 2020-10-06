import axios from "axios";

export default axios.create({
    baseURL: "https://avesbox-2020.glitch.me/",
    responseType: "json"
});