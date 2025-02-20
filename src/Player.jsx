import H5AudioPlayer from "react-h5-audio-player";
import 'react-h5-audio-player/lib/styles.css';
import {baseUrl, fetchUrl, Kind, white} from "./Singletons";
import sampleImg from "./Assets/SampleImg.png";
import {Navbar} from "./App.jsx";
import {useEffect, useState} from "react";
import parse from "html-react-parser";

const urlParams = new URLSearchParams(window.location.search);

let param = urlParams.get('play');
let playlistparam = urlParams.get('playlist');

function Player() {
    const [playlist, setPlaylist] = useState({});
    useEffect(() => {
        // TODO fetch playlist
    }, []);
    const [info, setInfo] = useState({
        song_name: "正在加载……",
        album_name: "",
        artist: "",
        kind: null,
    });
    const [albumcover, setAlbumcover] = useState({data: null, isloading: true})
    const [lyrics, setLyrics] = useState({
        lyrics: [{lyrics: ""}],
        selected: 0
    });
    useEffect(() => {

        async function f() {

            let infos = await (await fetch(baseUrl + "getSingle?id=" + param)).json()

            setInfo({
                ...info,

                artist: infos.artist,
                kind: infos.kind,

                song_name: infos.song_name,
                album_name: infos.album_name
            })
            setLyrics({
                ...lyrics,
                lyrics: (await (await fetch(baseUrl + "lyric", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: infos.song_name,
                        artist: infos.artist,
                        albumName: infos.album_name,
                    }),

                })).json())
            });
            setAlbumcover({

                data: (await (await fetch(baseUrl + 'getSingle?albumcover=true&id=' + param)).json()).albumcover,
                isloading: false
            })

        }

        f()

    }, [])
    const cover = albumcover.isloading ? white : (albumcover.data === null || albumcover.data.data.length === 0) ? sampleImg : URL.createObjectURL(new Blob([Uint8Array.from(albumcover.data.data).buffer]));
    return (
        <>
            <div className="">
                <Navbar isFixed={false}/>
                <div className={"container"}>
                    <div className={"row"}>
                        <div className={"col-xl-6 mt-4"}>
                            <div style={{
                                borderWidth: ".5px",
                                borderColor: "black",
                                borderStyle: "solid",
                                maxWidth: "500px",

                                backgroundSize: "contain"
                            }} className={"mx-auto "}>
                                <img src={cover} alt="cover" width="100%"/>

                            </div>
                            <div id={"no-card"} className={"card mx-auto mb-3 rounded-top-0"}
                                 style={{maxWidth: "500px"}}>
                                <div className={"card-body"}>
                                    <div className={"h6"}>
                                        {info.song_name}
                                    </div>
                                    <div>
                                        {info.album_name} - {info.artist}
                                    </div>
                                    <div>
                                        {Kind[info.kind]}
                                    </div>

                                </div>
                            </div>

                            <H5AudioPlayer src={fetchUrl + param} autoplay="autoplay" className={"mx-auto mb-3"}
                                           style={{maxWidth: "500px"}}
                            ></H5AudioPlayer>
                            <div className={"row mx-auto"} style={{
                                maxWidth: "500px"
                            }}>
                                <div className={"col-6 d-block mx-auto mb-3"}>
                                    <button className={"btn btn-light w-100 "}
                                            style={{
                                                borderStyle: "solid",
                                                borderColor: "gray",
                                                borderWidth: "thin",
                                                maxWidth: "500px"
                                            }}
                                            onClick={() => {
                                                window.location.href = fetchUrl + param;
                                            }}>下载
                                    </button>
                                </div>

                                <div className={"col-6 d-block mx-auto mb-3"}>
                                    <button className={"btn btn-light w-100 "} style={{
                                        borderStyle: "solid",
                                        borderColor: "gray",
                                        borderWidth: "thin",
                                    }} onClick={() => {
                                        window.location.href = "/pitched-download?id=" + param;
                                    }}>升降调下载
                                    </button>
                                </div>

                            </div>

                        </div>
                        <div className={" col-xl-6 p-4 "} style={{maxHeight: "87vh"}}>
                            <select style={{margin: "auto"}} className={"form-select mb-3 select "} onChange={(e) => {
                                setLyrics({
                                    ...lyrics,
                                    selected: e.target.value
                                })
                            }}>
                                {
                                    lyrics.lyrics.length === 0 ? <option>{"无"}</option> :
                                    lyrics.lyrics.map((data, i) => {
                                        return <option value={i}
                                                       key={i}>{data.title} - {data.artists} - {data.album}</option>
                                    })
                                }
                            </select>
                            <div className={"lyric-box"}
                                 style={{
                                     margin: "auto",
                                     display: "flex",
                                     flexDirection: "column",
                                     maxHeight: "100%"
                                 }}>


                                <div style={{
                                    width: '100%',
                                    overflow: 'scroll',
                                    scrollbarWidth: 'none',
                                    borderRadius: ".5rem",
                                    borderColor: "gray",
                                    borderWidth: ".3px",
                                    borderStyle: "solid"
                                }} className={"bg-light p-5 "}>
                                    {
                                        lyrics.lyrics.length === 0 ? "未找到歌词" :
                                            parse(lyrics.lyrics[lyrics.selected].lyrics.replaceAll(new RegExp("\\[[^\\[\\]]*]", "g"), "").trim().replaceAll("\n", "<br>"))

                                    }
                                </div>
                            </div>

                        </div>

                    </div>

                </div>
            </div>

        </>

    )
}

export default Player;