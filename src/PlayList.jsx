import {Navbar} from "./App.jsx";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {baseUrl, fetchUrl, Kind} from "./Singletons.js";
import {Button, ButtonGroup, Container, Grid, Image, NumberInput, Switch, Table} from "@mantine/core";
import sampleImg from "./Assets/SampleImg.png";
import H5AudioPlayer from "react-h5-audio-player";


function PlayList({createNew}) {
    Array.prototype.swap = function (x, y) {
        let b = this[x];
        this[x] = this[y];
        this[y] = b;
        return this;
    }
    const [list, setList] = useState([]);
    const [index, setIndex] = useState(0);
    const params = useParams();
    const [login, setLogin] = useState({
        loggedIn: false,
        uuid: "",
        username: "",
        email: "",
    });
    const [playlistParams, setPlaylistParams] = useState({
        playlistuuid: null,
        content: [],
        private: false,
        tmb: null,
        title: "正在加载",
        owner: null,
    })
    useEffect(() => {
        async function f() {
            let success = false;
            let res = await fetch(fetchUrl + "userapi", {
                credentials: "include",
            })
            if (res.ok) {
                success = true;
                let json = await res.json();
                setLogin({
                    loggedIn: true,
                    uuid: json.uuid,
                    username: json.username,
                    email: json.email,
                })
            }
            if (createNew) {
                if (!success) {
                    window.location.href = "/login"
                }

            } else {
                let info = (await (await fetch(fetchUrl + "playlist?playlistuuid=" + params.playlistuuid, {
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    }
                })).json())
                const listLocal = [];

                for (let uuidstr of info.content) {
                    let song_info = await (await fetch(baseUrl + "getSingle?id=" + uuidstr)).json()
                    listLocal.push({
                        uuid: uuidstr,
                        albumcover: (await (await fetch(baseUrl + "getSingle?albumcover=true&id=" + uuidstr)).json()).albumcover,
                        song_name: song_info.song_name,
                        album_name: song_info.album_name,
                        artist: song_info.artist,
                        kind: song_info.kind,
                        addr: fetchUrl + uuidstr,
                    })


                }
                console.log(listLocal[1].albumcover)

                setList(listLocal)
                setPlaylistParams({
                    playlistuuid: params.playlistuuid,
                    content: info.content,
                    private: info.private,
                    tmb: info.tmb,
                    title: info.title,
                    owner: await (await fetch(fetchUrl + "userapi?getname=true&uuid=" + info.owner, {
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json"
                        }
                    })).text()
                })
            }

        }

        f();


    }, [])


    return (
        <>
            <Navbar isFixed={true}/>
            <Container style={{marginTop: "5rem"}}>
                <Grid gutter={"md"}>

                    <Grid.Col span={{base: 12, sm: 5}}>

                        <Image id={"listTmb"} src={playlistParams.tmb ? playlistParams.tmb : sampleImg}
                               className={"border-black border-1 rounded-3 shadow"} style={{width: "100%"}}/>

                        <div className={"mt-4 text-center h4"}>{playlistParams.title}</div>
                        <div className={"mt-3 text-center h6"}>{playlistParams.owner}</div>
                        <Switch style={{margin: "auto", width: "fit-content"}} className={"mt-3"} label={"公开"}
                                checked={!playlistParams.private} onChange={() => {

                        }}/>
                        <div className={"mt-4 shadow-lg rounded-3 overflow-hidden"}>
                            <div className={"p-3 d-flex gap-3"}>
                                <div>
                                    <Image
                                        src={list[index] ? list[index].albumcover.data.length !== 0 ? URL.createObjectURL(new Blob([Uint8Array.from(list[index].albumcover.data).buffer])) : sampleImg : sampleImg}
                                        style={{
                                            width: "3rem",
                                            height: "3rem",
                                            borderStyle: "solid",
                                            overflow: "auto",
                                            borderWidth: "0.3px",
                                            borderColor: "gray"
                                        }}/>
                                </div>
                                <div className={"d-flex flex-column"}>
                                    <span
                                        style={{fontSize: "larger"}}>{list[index] ? list[index].song_name : "正在加载"}</span>
                                    <span
                                        style={{fontSize: "small"}}>{list[index] ? list[index].song_name : null}</span>
                                </div>
                            </div>
                            <H5AudioPlayer showSkipControls={true} style={{boxShadow: "none"}}
                                           src={list[index] ? list[index].addr : null} onClickNext={() => {
                                if (index + 1 > list.length - 1) {
                                    setIndex(0)
                                } else {
                                    setIndex(index + 1);

                                }

                            }} onClickPrevious={() => {
                                if (index - 1 < 0) {
                                    setIndex(list.length - 1)
                                } else {
                                    setIndex(index - 1);

                                }
                            }}/>

                        </div>


                    </Grid.Col>

                    <Grid.Col span={{base: 12, sm: 7}}>
                        <Button fullWidth>保存</Button>
                        <Table className={"mt-3"} striped withTableBorder highlightOnHover>
                            <Table.Tbody>
                                {list.map((item, index) => (
                                    <Table.Tr key={index}>

                                        <Table.Td onClick={() => {
                                            setIndex(index)
                                        }}>
                                            <div style={{
                                                width: '3rem', height: "3rem", borderStyle: "solid",
                                                overflow: "auto",
                                                borderWidth: "0.3px",
                                                borderColor: "gray"
                                            }}>
                                                <Image
                                                    src={list[index] ? list[index].albumcover.data.length !== 0 ? URL.createObjectURL(new Blob([Uint8Array.from(list[index].albumcover.data).buffer])) : sampleImg : sampleImg}/>

                                            </div>
                                        </Table.Td>
                                        <Table.Td onClick={() => {
                                            setIndex(index)
                                        }}>{item.song_name}</Table.Td>
                                        <Table.Td onClick={() => {
                                            setIndex(index)
                                        }}>{item.artist}</Table.Td>
                                        <Table.Td onClick={() => {
                                            setIndex(index)
                                        }}>{item.album_name}</Table.Td>
                                        <Table.Td onClick={() => {
                                            setIndex(index)
                                        }}>{Kind[item.kind]}</Table.Td>
                                    </Table.Tr>
                                ))}
                                <Table.Tr>
                                    <Table.Td colSpan={5} style={{height: "3rem"}}>
                                        <div style={{textAlign: "center", userSelect: "none"}}>
                                            +
                                        </div>
                                    </Table.Td>
                                </Table.Tr>
                            </Table.Tbody>
                        </Table>
                    </Grid.Col>
                </Grid>
            </Container>

        </>

    )
}

export default PlayList;