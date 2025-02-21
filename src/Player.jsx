import H5AudioPlayer from "react-h5-audio-player";
import 'react-h5-audio-player/lib/styles.css';
import {baseUrl, fetchUrl, Kind, white} from "./Singletons.js";
import sampleImg from "./SampleImg.png";
import {Navbar} from "./App.jsx";
import {useEffect, useState} from "react";
import parse from "html-react-parser";
import {NavLink} from "react-router-dom";

const urlParams = new URLSearchParams(window.location.search);

let param = urlParams.get('play');
// TODO Wasteful base64. BASE64 is shit. 18MB->66MB. Nice bruh. AWWWWFULLLLLLLL!!!!!!
function Player() {

    const [info, setInfo] = useState({
        song_name: "正在加载……",
        album_name: "",
        artist: "",
        kind: null,
    });
    const [albumcover, setAlbumcover] = useState({data: null, isloading: true, blob: null})
    const [lyrics, setLyrics] = useState({
        lyrics: [{lyrics: ""}],
        selected: 0
    });
    useEffect(() => {
        let myWorker = new Worker(new URL("WebWorkerPoly.js", import.meta.url));
        myWorker.postMessage({
            type: 0, param: param, url: baseUrl
        })
        myWorker.onmessage = e => {
            setAlbumcover({

                data: e.data,
                isloading: false, blob: e.data ?  URL.createObjectURL(new Blob([Uint8Array.from(e.data.data).buffer])) : null
            })
        }

        myWorker = new Worker(new URL("WebWorkerPoly.js", import.meta.url));
        myWorker.postMessage({
            type: 1, param: param, url: baseUrl
        })
        myWorker.onmessage = e => {
            let info_local = e.data
            setInfo({
                ...info,

                artist: e.data.artist,
                kind: e.data.kind,

                song_name: e.data.song_name,
                album_name: e.data.album_name
            })
            myWorker = new Worker(new URL("WebWorkerPoly.js", import.meta.url));
            myWorker.postMessage({
                type: 2, info: info_local, url: baseUrl
            })
            myWorker.onmessage = e => {
                setLyrics({
                    ...lyrics,
                    lyrics: e.data,
                });
            }

        }


    }, [])
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
                                <img src={albumcover.isloading ? white : (albumcover.data === null || albumcover.data.data.length === 0) ? sampleImg : albumcover.blob} alt="cover" width="100%"/>

                            </div>
                            <div id={"no-card"} className={"card mx-auto mb-3 rounded-top-0"}
                                 style={{maxWidth: "500px"}}>
                                <div className={"card-body"}>
                                    <div className={"h3"}>
                                        {info.song_name}
                                    </div>
                                    <div >
                                        <a className={"text-dark"} href={"/search?p="+info.album_name}>{info.album_name}</a>
                                          <br/>
                                        <a className={"text-dark"} href={"/search?p="+info.artist}>{info.artist}</a>
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
                                                           key={i}>{data.title} - {data.artist ? data.artist : data.artists} - {data.album}</option>
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