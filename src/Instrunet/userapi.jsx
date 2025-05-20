///temp

import {fetchUrl} from "../Singletons.js";

function Userapi() {
    fetch(fetchUrl + "userapi", {
        credentials: "include",
    }).then(response => response.json()).then(data => console.log(data));
}

export default Userapi;