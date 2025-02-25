import {Navbar} from "./App.jsx";
import {useEffect, useState} from "react";
import {fetchUrl} from "./Singletons";
import Akkarin from './Assets/Transparent_Akkarin.png'
import {Link as RLink} from "react-router-dom";

function Home() {
    const [loading, setLoading] = useState(true);
    const [login, setLogin] = useState({
        loggedIn: false,
        uuid: "",
        username: "",
        email: "",
    });
    const [avatar, setAvatar] = useState(null)
    const [playlist, setPlaylist] = useState([])
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
            setAvatar(await (await fetch(fetchUrl + "avatar?uuid=" + login.uuid)).arrayBuffer())
        }

        if (login.loggedIn) {

            f()
        }
    }, [login]);
    useEffect(()=>{
        async function f() {
            setPlaylist(await (await fetch(fetchUrl + "playlist", {
                method: "POST",
                credentials: "include",
            })).json())
        }
        if (login.loggedIn) {

            f()
        }
    }, [login])

    function Avatar() {
        const [hover, setHover] = useState(false);
        return (<>
            <div onMouseEnter={(e) => {
                setHover(true);
            }} onMouseLeave={(e) => {
                setHover(false)

            }} className={"rounded rounded-circle border-1 border-secondary-subtle border  overflow-hidden"}
                 style={{
                     position: "relative", display: "inline-block", pointerEvents: 'visiblePainted',
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
                        <input  type={"file"} className={"rounded rounded-circle"} style={{opacity: 0, position: "absolute", width: "100%", height: "100%", pointerEvents: "visiblePainted"}} />
                        <i className={"bi-camera "} style={{
                            color: "white",
                            fontSize: "25cqw",

                        }}></i>
                    </div>
                </div>
                <img


                    className={"img-fluid w-auto h-auto  "}
                    src={avatar ? avatar.byteLength === 0 ? Akkarin : avatar : Akkarin} alt={"avatar"}/>
            </div>
        </>)
    }

    return (<>
        <Navbar username={login.username} isFixed={false}/>
        <div className={"container  mt-5 "}>
            <div className={"row "} style={{height: '45rem'}}>
                <div className={"col-md-6"}>
                    <div style={{textAlign: "center", userSelect: "none"}}>

                        <Avatar/>
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

                            <div className={"container h-100 p-3 user-land bg-light rounded-3  border-black border-1 border-opacity-25"} style={{borderStyle: "solid"}}>
                                歌单
                                <br/>
                               <div style={{display: "flex", flexDirection: "row"}} className={"mt-2"}>
                                   {playlist.length === 0 ? null : playlist.map((item, index) => {
                                        
                                   })} <RLink style={{display: "flex", justifyContent: "space-around", alignItems:"center"}} className={"btn btn-primary pl-item"} to={"/playlist"}>添加</RLink>
                               </div>

                            </div>


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