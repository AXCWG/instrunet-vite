onmessage = async e => {
    let fetchUrl = e.data.url;
    let uuid = e.data.uuid;
    let res = await (await fetch(fetchUrl + "playlist-name?playlistuuid=" + uuid, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })).text()
    postMessage(res)
}