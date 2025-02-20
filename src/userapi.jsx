///temp

import {fetchUrl} from "./Singletons";

function Userapi() {
    fetch(fetchUrl + "userapi", {
        credentials: "include",
    }).then(response => response.json()).then(data => console.log(data));
}

export default Userapi;