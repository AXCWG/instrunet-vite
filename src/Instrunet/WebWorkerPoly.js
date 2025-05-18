
onmessage = async event => {
    let baseUrl = event.data.url;
    /**
     * 0: Album Cover
     * 1: Info
     * 2: Lyrics
     *
     * **/
    if(event.data.type===0){
        const data = (await (await fetch(baseUrl + 'getSingle?albumcover=true&id=' + event.data.param)).json()).albumcover;
        postMessage(data);

    }if(event.data.type===1){
        const info = await (await fetch(baseUrl + "getSingle?id=" + event.data.param)).json();
        postMessage(info);
    }
    if(event.data.type===2){
        const lrc = (await (await fetch(baseUrl + "lyric", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: event.data.info.song_name,
                artist: event.data.info.artist,
                albumName: event.data.info.album_name,
            }),

        })).json())
        postMessage(lrc)
    }
}