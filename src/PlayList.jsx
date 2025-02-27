import {Navbar} from "./App.jsx";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {baseUrl, fetchUrl, Kind} from "./Singletons.js";
import {Button, ButtonGroup, Container, Grid, Image, Input, Modal, NumberInput, Switch, Table} from "@mantine/core";
import sampleImg from "./Assets/SampleImg.png";
import H5AudioPlayer from "react-h5-audio-player";
import {useDisclosure} from "@mantine/hooks";
import log from "eslint-plugin-react/lib/util/log.js";


function PlayList({createNew}) {
    const [opened, {open, close}] = useDisclosure(false);
    Array.prototype.swap = function (x, y) {
        let b = this[x];
        this[x] = this[y];
        this[y] = b;
        return this;
    }
    const [list, setList] = useState({
        list: [], owner: "", playlistuuid: ""
    });
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
                    let pre = (await (await fetch(baseUrl + "getSingle?albumcover=true&id=" + uuidstr)).json()).albumcover
                    let song_info = await (await fetch(baseUrl + "getSingle?id=" + uuidstr)).json()
                    listLocal.push({
                        uuid: uuidstr,
                        albumcover: pre.data.length !== 0 ? URL.createObjectURL(new Blob([Uint8Array.from(pre.data).buffer])) : sampleImg,
                        song_name: song_info.song_name,
                        album_name: song_info.album_name,
                        artist: song_info.artist,
                        kind: song_info.kind,
                        addr: fetchUrl + uuidstr,
                    })


                }


                setList({list: listLocal, owner: info.owner, playlistuuid: info.uuid});
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
    console.log(list);

    const [results, setResults] = useState([])

    return (
        <>
            <Modal size={"auto"} zIndex={1031} opened={opened} onClose={close} title="搜索">
                <Input onChange={async (e) => {

                    setResults(
                        await (await fetch(fetchUrl + "search_api", {
                            method: "POST",
                            body: JSON.stringify(
                                {
                                    searchStr: e.target.value,
                                }
                            ),
                            headers: {
                                "Content-Type": "application/json"
                            }
                        })).json()
                    )


                }}></Input>
                <Table>
                    <Table.Tbody>
                        {results.map((item, index) => {
                                async function click() {
                                    let pre = (await (await fetch(baseUrl + "getSingle?albumcover=true&id=" + item.uuid)).json()).albumcover

                                    setList(list.list.concat([{
                                        addr: fetchUrl + item.uuid,
                                        album_name: item.album_name,
                                        albumcover: pre.data.length !== 0 ? URL.createObjectURL(new Blob([Uint8Array.from(pre.data).buffer])) : sampleImg,
                                        artist: item.artist,
                                        kind: item.kind,
                                        song_name: item.song_name,
                                        uuid: item.uuid,


                                    }]))
                                    close();

                                }

                                return <>
                                    <Table.Tr key={index}>

                                        <Table.Td onClick={click}>{item.song_name}</Table.Td>
                                        <Table.Td onClick={click}>{item.artist}</Table.Td>
                                        <Table.Td onClick={click}>{item.album_name}</Table.Td>
                                        <Table.Td onClick={click}>{Kind[item.kind]}</Table.Td>

                                    </Table.Tr>

                                </>
                            }
                        )
                        }

                    </Table.Tbody>
                </Table>
            </Modal>
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
                                        src={list.list[index] ? list.list[index].albumcover : sampleImg}
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
                                        style={{fontSize: "larger"}}>{list.list[index] ? list.list[index].song_name : "正在加载"}</span>
                                    <span
                                        style={{fontSize: "small"}}>{list.list[index] ? list.list[index].song_name : null}</span>
                                </div>
                            </div>
                            <H5AudioPlayer showSkipControls={true} style={{boxShadow: "none"}}
                                           src={list.list[index] ? list.list[index].addr : null} onClickNext={() => {
                                if (index + 1 > list.list.length - 1) {
                                    setIndex(0)
                                } else {
                                    setIndex(index + 1);

                                }

                            }} onClickPrevious={() => {
                                if (index - 1 < 0) {
                                    setIndex(list.list.length - 1)
                                } else {
                                    setIndex(index - 1);

                                }
                            }}/>

                        </div>


                    </Grid.Col>

                    <Grid.Col span={{base: 12, sm: 7}}>
                        {login.uuid && list.owner && login.uuid === list.owner ? <Button fullWidth>保存</Button> : null }

                        <Table className={"mt-3"} striped withTableBorder highlightOnHover>
                            <Table.Tbody>
                                {list.list.map((item, index) => (
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
                                                    src={list.list[index] ? list.list[index].albumcover : sampleImg}/>

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
                                    {login.uuid && list.owner && login.uuid === list.owner ?  <Table.Td colSpan={5} style={{height: "3rem"}}>

                                        <div onClick={() => open()}
                                             style={{textAlign: "center", userSelect: "none"}}>
                                            添加
                                        </div>
                                    </Table.Td> : null }

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