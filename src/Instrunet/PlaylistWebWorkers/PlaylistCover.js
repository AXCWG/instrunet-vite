onmessage = async event => {

    let baseUrl = event.data.url;
    let uuid = event.data.uuid;
    let tmb = await (await fetch(baseUrl + "playlist-tmb?playlistuuid=" + uuid, {
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        }
    })).json()
    postMessage(tmb)
}