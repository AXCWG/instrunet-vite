import {Navbar} from "./App.jsx";
import {useEffect, useState} from "react";
import {fetchUrl, white} from "./Singletons";
import Akkarin from './Assets/Transparent_Akkarin.png'
import {Link as RLink} from "react-router-dom";
import SampleImg from "./Assets/SampleImg.png"
import {Image, Modal} from "@mantine/core";
import Cropper from 'react-easy-crop'
import {useDisclosure} from "@mantine/hooks";



function Home() {
    function PlayList() {
        const [playlist, setPlaylist] = useState([])
        const [inEdit, setInEdit] = useState(false)

        useEffect(() => {
            async function f() {
                setPlaylist(await (await fetch(fetchUrl + "playlist-owned", {
                    method: "POST",
                    credentials: "include",
                })).json())
            }

            if (login.loggedIn) {

                f()
            }
        }, [login])
        return <div
            className={"container h-100 p-3 user-land bg-light rounded-3  border-black border-1 border-opacity-25"}
            style={{borderStyle: "solid",}}>
            歌单
            <br/>
            <div style={{
                display: "flex",
                scrollbarWidth: "auto",
                flexDirection: "row",
                overflow: "scroll",
                gap: "5px",
                alignItems: "center"
            }}
                 className={"mt-2"}>
                {playlist.length === 0 ? null : playlist.map((item, index) => {

                    return inEdit ? <RLink key={index} style={{
                            justifyContent: "space-around",
                            alignItems: "center",
                            borderStyle: "solid",
                            borderWidth: "0.3px",
                            borderColor: "gray"
                        }} className={"pl-item"} onClick={async () => {
                            let res = await fetch(fetchUrl + "remove-playlist", {
                                credentials: "include",
                                headers: {
                                    "Content-Type": "application/json",

                                },
                                method: "POST",
                                body: JSON.stringify({
                                    playlistuuid: item.uuid
                                })
                            })
                            if (res.ok) {
                                setInEdit(false)
                                window.location.reload()
                            }

                        }}>
                            <Image
                                src={(item.tmb.data && item.tmb.data.length !== 0) ? URL.createObjectURL(new Blob([Uint8Array.from(item.tmb.data)])) : SampleImg}></Image></RLink> :
                        <RLink key={index} style={{
                            justifyContent: "space-around",
                            alignItems: "center",
                            borderStyle: "solid",
                            borderWidth: "0.3px",
                            borderColor: "gray",

                        }} className={"pl-item"} to={"/playlist/" + item.uuid}><Image
                            src={(item.tmb.data && item.tmb.data.length !== 0) ? URL.createObjectURL(new Blob([Uint8Array.from(item.tmb.data)])) : SampleImg}></Image></RLink>
                })}
                {inEdit ? <RLink
                    style={{
                        display: "flex", justifyContent: "space-around", alignItems: "center",
                        width: "5rem",
                        height: "5rem", flexShrink: 0
                    }}
                    className={"btn btn-primary"} onClick={() => {
                    setInEdit(false)
                }}>取消</RLink> : <><RLink
                    style={{
                        display: "flex", justifyContent: "space-around", alignItems: "center",
                        width: "5rem",
                        height: "5rem", flexShrink: 0
                    }}
                    className={"btn btn-primary"} to={"/playlist"}>添加</RLink>
                    <RLink
                        style={{
                            display: "flex",
                            justifyContent: "space-around",
                            alignItems: "center",
                            width: "5rem",
                            height: "5rem", flexShrink: 0
                        }}
                        className={"btn btn-danger"} onClick={() => {
                        setInEdit(true)
                    }}>删除</RLink></>
                }
            </div>

        </div>;
    }
    const [opened, {open, close}] = useDisclosure(false);

    const [loading, setLoading] = useState(true);
    const [login, setLogin] = useState({
        loggedIn: false,
        uuid: "",
        username: "",
        email: "",
    });
    const [avatar, setAvatar] = useState(null)
    useEffect(() => {
        async function f() {
            let res = await fetch(fetchUrl + "userapi", {
                credentials: "include",
            })
            setLoading(false)
            if (res.ok) {
                let json = await res.json();
                setLogin({
                    loggedIn: true,
                    uuid: json.uuid,
                    username: json.username,
                    email: json.email,
                })
            } else {
                window.location.href = "/login"

            }


        }

        f()

    }, [])

    useEffect(() => {
        async function f() {
            setAvatar(URL.createObjectURL(new Blob([await (await fetch(fetchUrl + "avatar?uuid=" + login.uuid)).arrayBuffer()])))
        }

        if (login.loggedIn) {

            f()
        }
    }, [login]);


    const [forCrop, setForCrop] = useState(new Blob())

    function Avatar() {
        const [hover, setHover] = useState(false);


        return (<>

            <div onMouseEnter={(e) => {
                setHover(true);
            }} onMouseLeave={(e) => {
                setHover(false)

            }} className={"rounded rounded-circle border-1 border-secondary-subtle border  overflow-hidden"}
                 style={{
                     position: "relative",
                     display: "inline-block",
                     pointerEvents: 'visiblePainted',
                     width: "100%",
                     maxHeight: "500px",
                     maxWidth: "500px",
                     height: "fit-content"
                 }}
            >
                <div className={"avatar bg-dark"} style={{
                    position: "absolute",
                    margin: "auto",
                    left: 0,
                    right: 0,
                    height: "100%",
                    width: "100%",
                    zIndex: "999",
                    opacity: hover ? .5 : 0,
                    pointerEvents: 'none',
                }}>
                    <div style={{
                        containerType: "inline-size",
                    }} className={"h-100 w-100 d-flex align-items-center justify-content-center"}>
                        <input type={"file"} accept={"image/*"} className={"rounded rounded-circle"} style={{
                            opacity: 0,
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            pointerEvents: "visiblePainted"
                        }} onChange={async (e) => {
                            // setForCrop(e.target.files[0])
                            // open()
                            //TODO Image cropping

                            let fileArray = new Uint8Array(await e.target.files[0].arrayBuffer());

                            let res = await fetch(fetchUrl + "avatar", {
                                method: "POST",
                                credentials: "include",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    avatar: fileArray,
                                })
                            })
                            if (res.ok) {
                                window.location.reload()
                            }
                        }}/>
                        <i className={"bi-camera "} style={{
                            color: "white",
                            fontSize: "25cqw",

                        }}></i>
                    </div>
                </div>
                <img


                    className={"img-fluid h-auto  w-100 "}
                    src={avatar ? avatar.byteLength === 0 ? Akkarin : avatar : white} alt={"avatar"}/>
            </div>
        </>)
    }

    function Crop() {
        const [zoom, setZoom] = useState(1)
        const [crop, setCrop] = useState({
            x: 0, y: 0
        })
        return <Modal size={"lg"} styles={{
            content: {
                height: "100rem",
            }
        }} zIndex={1031} opened={opened} onClose={close} title={"编辑"}>
            <Cropper onCropComplete={(croppedArea, croppedAreaPixels) => {
                console.log(croppedAreaPixels, croppedArea)
            }} style={{
                containerStyle: {
                    height: "100%",
                }
            }} image={URL.createObjectURL(forCrop)} crop={crop} zoom={zoom} aspect={1} onCropChange={setCrop}
                     onZoomChange={setZoom}></Cropper>
        </Modal>
    }
    return (<>
        {/*<Crop/>*/}
        <Navbar username={login.username} isFixed={false}/>
        <div className={"container  mt-5 "}>
            <div className={"row "} style={{height: '45rem'}}>
                <div className={"col-md-6"}>
                    <div style={{textAlign: "center", userSelect: "none"}}>

                        <Avatar/>
                        <div className={"mt-3"} style={{color: "gray"}}>
                            {"点击头像以更改"}

                        </div>
                        <div className={"display-6 mt-3"}>{login.username}</div>
                        <div className={"mt-3"}>{login.email ? login.email : "未设置邮箱"}</div>

                    </div>


                </div>
                <div className={"col-md-6 t mt-3 mt-md-0"}>
                    <div
                        className={"container h-100 p-3 user-land bg-light rounded-3  border-black border-1 border-opacity-25"}
                        style={{borderStyle: "solid"}}>
                        <div>
                            用户功能
                        </div>
                        <div className={"mt-3"} style={{
                            display: "flex",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                            flexDirection: "column",
                            gap: "1rem",
                        }}>


                            {<PlayList/>}


                            <button onClick={() => {
                                window.location.href = "/logout"
                            }} className={"btn btn-secondary"}>登出
                            </button>
                            <button className={"btn btn-danger"} onClick={() => {
                                window.location.href = "/AccDel"
                            }}>删除账号
                            </button>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    </>)
}

export default Home