import H5AudioPlayer from "react-h5-audio-player";
import 'react-h5-audio-player/lib/styles.css';
import {baseUrl, fetchUrl, Kind, WebRoutes, white} from "../Singletons.js";
import sampleImg from "./Assets/SampleImg.png";
import {Navbar} from "./App.jsx";
import {useEffect, useState} from "react";
import parse from "html-react-parser";
import {Button, Card, TextInput} from "@mantine/core";

const urlParams = new URLSearchParams(window.location.search);

let param = urlParams.get('play');

// eslint-disable-next-line react/prop-types
function CommentSegments({parent, root, masterUuid, userUuid, content}) {
    const [username, setUsername] = useState("正在加载");
    const [usernameReplyTo, setUsernameReplyTo] = useState("正在加载");
    const [cs, setCs] = useState([])
    const [commentContent, setCommentContent] = useState("");
    const [commentMode, setCommentMode] = useState(false);
    useEffect(() => {
        async function f() {
            const response = await fetch(`${baseUrl}userapi?uuid=${userUuid}&getname=true`)
            const us = await response.text();
            setUsername(us)
            const response2 = await fetch(`${baseUrl}api/community/getcomment?uuid=${masterUuid}`)
            const nest = await response2.json();
            setCs(nest)
            // eslint-disable-next-line react/prop-types
            const response3 = await (await fetch(`${baseUrl}userapi?uuid=${parent.parent.poster}&getname=true`)).text()
            setUsernameReplyTo(response3)
        }

        f()
        // eslint-disable-next-line react/prop-types
    }, [masterUuid, parent.poster, userUuid])
    return <>
        <div style={{width: '100%', borderBottomStyle: "solid", padding: ".5rem"}}
             className={"border-1 border-secondary-subtle border-opacity-100 "}>
            <div style={{
                flexGrow: 1,
                display: "inline-block"
            }}>{username + (root ? "" : " 回复：" + usernameReplyTo)}: {content}</div>
            <div style={{textAlign: "end",}}>
                {
                    commentMode ? <>
                            <div style={{display: "flex",}}>
                                <div style={{width: "50%"}}></div>
                                <div style={{display: "flex", width: "50%"}}>
                                    <TextInput onChange={(e)=>{
                                        setCommentContent(e.target.value)
                                    }} style={{width: "unset"}}/>
                                    <Button onClick={async ()=>{
                                        if(!commentContent) {
                                            alert("不可发送空白信息")
                                            return;
                                        }
                                        if(commentContent.length <=5) {
                                            alert("请发送超过5个字的评论")
                                            return;
                                        }
                                        const res = await fetch(`${fetchUrl}api/community/postcomment`, {
                                            method: "POST",
                                            body: JSON.stringify({
                                                content: commentContent,
                                                master: masterUuid,
                                            }),
                                            credentials: "include",
                                            headers: {
                                                "Content-Type": "application/json",
                                            }
                                        })
                                        if(res.ok) {
                                            window.location.reload()
                                        }else if(res.status === 401) {
                                            window.location.href = WebRoutes.instruNet + "/login"
                                        }else {
                                            alert("未知错误。")
                                        }
                                    }}>发送</Button>
                                </div>
                            </div>


                        </>
                        : <div style={{display: "inline-block", cursor: "default"}} onClick={(e) => {
                            setCommentMode(true)
                        }}>回复
                        </div>
                }

            </div>

        </div>

        {
            cs.map((item, index) => {
                item.parent = parent;
                return <CommentSegments parent={item} root={false} masterUuid={item.uuid} key={index}
                                        content={item.content} userUuid={item.poster}/>
            })
        }
    </>
}

// eslint-disable-next-line react/prop-types
function Comments({uuid}) {
    const [opened, setOpened] = useState(localStorage.getItem("commentOpen") ? localStorage.getItem("commentOpen") === "true" : true);
    const [cs, setCs] = useState([]);
    const [commentContent, setCommentContent] = useState("");
    const [commentMode, setCommentMode] = useState(false);
    useEffect(() => {
        async function f() {
            const response = await fetch(`${baseUrl}api/community/getcomment?uuid=${uuid}`)
            const json = await response.json()
            setCs(json)
        }

        f()
    }, [uuid])
    return <>
        <Card withBorder={true} style={{marginBottom: "1rem"}}>
            <Button style={{marginBottom: "1rem", display: opened ? "block" : "none"}} onClick={() => {
                setOpened(false)
                localStorage.setItem("commentOpen", false)
            }}>关闭</Button>
            <Button style={{display: !opened ? "block" : "none"}} onClick={() => {
                setOpened(true)
                localStorage.setItem("commentOpen", true)
            }}>开启</Button>
            <div style={{borderTopStyle: cs.length === 0 ? "none" : "solid", display: opened ? "block" : "none"}}
                 className={"border-1 border-secondary-subtle border-opacity-100 "}>
                {
                    cs.length !== 0 ? cs.map((item, index) => {

                        // masterUuid not really "it's master", but rather the "current master".
                        /**
                         * E.g. Comment "ascare" under song with "uuid" "iioowls"
                         * the master uuid will be ascare but not iioowls.
                         * **/
                        return <CommentSegments parent={item} root={true} masterUuid={item.uuid} userUuid={item.poster}
                                                content={item.content} key={index}/>
                    }) : commentMode ?

                        <div style={{display: "flex"}}>
                            <TextInput onChange={(e) => {
                                setCommentContent(e.target.value)
                            }} style={{flexGrow: 1}}/>
                            <Button onClick={async () => {
                                if (!commentContent) {
                                    alert("不可发送空白信息")
                                    return;
                                }
                                if (commentContent.length <= 5) {
                                    alert("请发送超过5个字的评论")
                                    return;
                                }
                                const res = await fetch(`${fetchUrl}api/community/postcomment`, {
                                    method: "POST",
                                    body: JSON.stringify({
                                        content: commentContent,
                                        master: param,
                                    }),
                                    credentials: "include",
                                    headers: {
                                        "Content-Type": "application/json",
                                    }
                                })
                                if (res.ok) {
                                    window.location.reload()
                                }else if(res.status === 401) {
                                    window.location.href = WebRoutes.instruNet + "/login"
                                }else {
                                    alert("未知错误。")
                                }
                            }}>发送</Button>

                    </div> : <div style={{textAlign: "center"}}>无评论 <span style={{color: "gray"}} onClick={() => {
                        setCommentMode(!commentMode)
                    }}>点击评论</span></div>
                }
            </div>

        </Card>

    </>


}

function VoteComponent() {
    const [vote, setVote] = useState("l");
    useEffect(() => {
        fetch(fetchUrl + "api/community/getvote?uuid=" + param).then((res) => {
            res.text().then(s => setVote(s))
        })
    }, [])
    return <div className={"row mx-auto mb-3 g-1"} style={{maxWidth: "500px"}}>
        <div className={"col-5 d-block mx-auto"}>
            <Button fullWidth={true} color={"green"} onClick={() => {
                fetch(fetchUrl + "api/community/upvote", {
                    method: "POST",
                    body: `"${param}"`,
                    headers: {"Content-Type": "application/json"},
                    credentials: "include"
                }).then((res) => {
                    if (res.ok) {
                        fetch(fetchUrl + "api/community/getvote?uuid=" + param).then((res) => {
                            res.text().then(s => setVote(s))
                        })
                    } else if (res.status === 401) {
                        window.location.href = WebRoutes.instruNet + "/login"
                    } else if (res.status === 400) {
                        alert("想也知道 一個人理所當然只能投票一次。")
                    }
                })
            }}>赞</Button>
        </div>
        <div className={"col-2 mx-auto"}
             style={{textAlign: "center", display: "flex", justifyContent: "center", alignItems: "center"}}>
            {vote}
        </div>
        <div className={"col-5 d-block mx-auto"}>
            <Button fullWidth={true} color={"red"} onClick={() => {
                fetch(fetchUrl + "api/community/downvote", {
                    method: "POST",
                    body: `"${param}"`,
                    headers: {"Content-Type": "application/json"},
                    credentials: "include"
                }).then((res) => {
                    if (res.ok) {
                        fetch(fetchUrl + "api/community/getvote?uuid=" + param).then((res) => {
                            res.text().then(s => {
                                setVote(s)
                                if (s === "-10") {
                                    window.location.reload();
                                }
                            })
                        })
                    } else if (res.status === 401) {
                        window.location.href = WebRoutes.instruNet + "/login"
                    } else if (res.status === 400) {
                        alert("想也知道 一個人理所當然只能投票一次。")
                    }
                })
            }}>踩</Button>

        </div>
    </div>
}

// TODO Wasteful base64. BASE64 is shit. 18MB->66MB. Nice bruh. AWWWWFULLLLLLLL!!!!!!
function Player() {
    fetch(baseUrl + "getSingle?id=" + param).then((res) => {
        if (!(res.ok)) {
            window.location.href = "/404"
        }
    })

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
                isloading: false,
                blob: e.data ? URL.createObjectURL(new Blob([Uint8Array.from(e.data.data).buffer])) : null
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
    if ("mediaSession" in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: info ? info.song_name : null,
            artist: info ? info.artist : null,
            album: info ? info.album_name : null,
            artwork: [{
                src:
                    albumcover.isloading ? white : (albumcover.data === null || albumcover.data.data.length === 0) ? sampleImg : albumcover.blob,
                sizes: "512x512",
                type: "image/webp",
            }],

        });
    }
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
                                <img
                                    src={albumcover.isloading ? white : (albumcover.data === null || albumcover.data.data.length === 0) ? sampleImg : albumcover.blob}
                                    alt="cover" width="100%"/>

                            </div>
                            <div id={"no-card"} className={"card mx-auto mb-3 rounded-top-0"}
                                 style={{maxWidth: "500px"}}>
                                <div className={"card-body"}>
                                    <div className={"h3"}>
                                        {info.song_name}
                                    </div>
                                    <div>
                                        <a className={"text-dark"}
                                           href={WebRoutes.instruNet + "/search?p=" + info.album_name}>{info.album_name}</a>
                                        <br/>
                                        <a className={"text-dark"}
                                           href={WebRoutes.instruNet + "/search?p=" + info.artist}>{info.artist}</a>
                                    </div>
                                    <div>
                                        {Kind[info.kind]}
                                    </div>

                                </div>
                            </div>

                            <H5AudioPlayer src={fetchUrl + param} autoplay="autoplay" className={"mx-auto mb-3"}
                                           style={{maxWidth: "500px"}}
                            ></H5AudioPlayer>
                            <div className={"row mx-auto g-1"} style={{
                                maxWidth: "500px"
                            }}>
                                <div className={"col-6 d-block mx-auto mb-3"}>
                                    <Button fullWidth={true}
                                            onClick={() => {
                                                window.location.href = fetchUrl + param;
                                            }}>下载
                                    </Button>
                                </div>

                                <div className={"col-6 d-block mx-auto mb-3"}>
                                    <Button fullWidth={true} onClick={() => {
                                        window.location.href = WebRoutes.instruNet + "/pitched-download?id=" + param;
                                    }}>升降调下载
                                    </Button>
                                </div>

                            </div>
                            <VoteComponent/>
                            <div className={"row mx-auto g-1"} style={{
                                maxWidth: "500px"
                            }}>
                                <Comments uuid={param}/>
                            </div>


                        </div>
                        <div className={" col-xl-6 p-4 "} style={{maxHeight: "83vh"}}>
                            <select style={{margin: "auto"}} className={"form-select mb-3 select "}
                                    onChange={(e) => {
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
                            </select>{
                            lyrics.lyrics.length === 0 || lyrics.lyrics.some((i)=>{
                                return i.title === undefined && i.artist === undefined && i.album === undefined
                            })? null :<Button fullWidth={true} onClick={()=>{
                                const blob = new Blob([lyrics.lyrics[lyrics.selected].lyrics], {type: "text/binary"});
                                const url = URL.createObjectURL(blob);
                                const a =  document.createElement("a");
                                a.href=url;
                                a.download=lyrics.lyrics[lyrics.selected].title + '.lrc';
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                                URL.revokeObjectURL(url);
                            }} className={"mb-3"}>下载歌词</Button>
                        }

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