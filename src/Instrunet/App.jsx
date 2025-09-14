import '../App.css';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.bundle'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { useEffect, useState } from "react";
import { parseBlob, selectCover } from 'music-metadata'
import { baseUrl, fetchUrl, Kind, l, WebRoutes } from "../Singletons.js";
import { useCookies } from "react-cookie";
import { NavLink } from "react-router-dom";
import { Button, Flex } from "@mantine/core";
import TF from "./Assets/TF.png";


// TODO Localizations
// TODO 登录以管理XXXXXX

// eslint-disable-next-line react/prop-types
function Navbar({ isFixed, username }) {
    const [loading, setLoading] = useState(true);
    const [login, setLogin] = useState({
        loggedIn: false, uuid: "", username: "", email: "",
    });
    useEffect(() => {
        async function f() {
            let res = await fetch(fetchUrl + "userapi", {
                credentials: "include",
            })
            setLoading(false)
            if (res.ok) {
                let json = await res.json();
                setLogin({
                    loggedIn: true, uuid: json.uuid, username: json.username, email: json.email,
                })
                localStorage.setItem("acc", JSON.stringify({
                    loggedIn: true, uuid: json.uuid, username: json.username, email: json.email,
                }))
                if (json && (json.uuid === "7e29eb83-45a3-4a0c-ac61-3dc7375ab5ca" || json.username === "xiey0无节操")) {
                    localStorage.setItem("HelloKryze", true)
                }
            } else {
                localStorage.removeItem("acc");
            }

        }

        if (username === undefined || username === null) {
            f()
        }
    }, [username])


    return (<>


        <nav
            className={isFixed ? "navbar fixed-top navbar-expand-md bg-dark navbar-dark" : "navbar navbar-expand-md bg-dark navbar-dark"}>
            <div className="container-fluid">

                <NavLink className="navbar-brand" to={"/"}>返回</NavLink>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#collapsibleNavbar">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="collapsibleNavbar">
                    <ul className="navbar-nav" style={{ marginRight: "auto" }}>
                        <li className="nav-item">
                            <NavLink className="nav-link" to={WebRoutes.instruNet + "/"}>伴奏网主页</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to={WebRoutes.instruNet + "/Search"}>全部</NavLink>
                        </li>
                        <li className={"nav-item"}>
                            <NavLink className="nav-link" to={WebRoutes.instruNet + "/query"}>处理队列</NavLink>
                        </li>

                        <li className="nav-item">
                            <div className={"dropdown "}>
                                <button className="nav-link dropdown-toggle" type={"button"}
                                    data-bs-toggle={"dropdown"}
                                    aria-expanded={false}>联系我
                                </button>

                                <ul className={"dropdown-menu"}>
                                    <li><NavLink className={"dropdown-item"}
                                        to={"mailto:xiey0@qq.com"}>邮箱</NavLink></li>
                                    <li><NavLink className={"dropdown-item"}
                                        to={"https://message.bilibili.com/?spm_id_from=..0.0#/whisper/mid255413001"}>B站私信</NavLink>
                                    </li>
                                    <li><NavLink className={"dropdown-item"}
                                        to={"https://github.com/AXCWG/instrunet-vite/issues"}>GitHub
                                        Issues</NavLink>
                                    </li>

                                </ul>
                            </div>

                        </li>
                        <li className={"nav-item"}>

                            <a className="nav-link text-danger fw-bold "
                                href="https://afdian.com/a/re_xiey0" aria-expanded={false}>打赏
                            </a>


                        </li>
                        <li className={"nav-item"}>
                            <a className="nav-link text-danger fw-bold "
                                href="https://andyxie.cn:5000/" aria-expanded={false}>反馈论坛
                            </a>
                        </li>
                        <li className={"nav-item"}>
                            <a className="nav-link" href="https://github.com/AXCWG/instrunet-vite">GitHub</a>
                        </li>
                        <li className={"nav-item"}>
                            <NavLink className="nav-link" to={WebRoutes.instruNet + "/secret-page"}>神秘小网页</NavLink>
                        </li>


                    </ul>
                    <div className="d-flex">


                        {!username ? loading ? null : login.loggedIn ?
                            <a className={"text-decoration-none me-3 right-hand"}
                                href={WebRoutes.instruNet + "/home"}>{login.username}</a> : <>
                                <a className={" text-decoration-none me-3 right-hand"}
                                    href={WebRoutes.instruNet + "/login"}>登录</a>
                                <a className={" text-decoration-none me-1 right-hand"}
                                    href={WebRoutes.instruNet + "/register"}>注册</a>
                            </> : <a className={"text-decoration-none me-3 right-hand"}
                                href={WebRoutes.instruNet + "/home"}>{username}</a>

                        }

                    </div>
                </div>
            </div>
        </nav>

    </>)
}
// TODO Website logging
function App() {
    const [helloKryze, setHelloKryze] = useState("false");
    const [loginHelloKryze, setLoginHelloKryze] = useState(null);

    const [cookies, setCookie] = useCookies(['InstruNet'], { doNotParse: true })

    const [form, setForm] = useState({
        name: "未知名称",
        albumName: "",
        link: "",
        file: {},
        email: cookies["email"] ? localStorage.getItem("acc") ? JSON.parse(localStorage.getItem("acc")).email : cookies["email"] : "",
        artist: "",
        kind: [0],
        albumCover: ""
    })
    const [ncmForm, setncmForm] = useState({
        id: "",
        email: localStorage.getItem("acc") ? JSON.parse(localStorage.getItem("acc")).email : cookies["email"],
        kind: [0],
    })

    const [loading, setLoading] = useState(false);

    function Prevent(e) {
        e.preventDefault()
    }

    function searchGeneral() {
        window.location.href = WebRoutes.instruNet + "/search?p=" + searchParam;
    }

    const [state, setState] = useState(-1)

    if (localStorage.getItem("HelloKryze") !== helloKryze) {
        setHelloKryze(localStorage.getItem("HelloKryze"))
    }
    useEffect(() => {
        async function f() {
            let res = await fetch(fetchUrl + "userapi", {
                credentials: "include",
            })
            setLoading(false)
            if (res.ok) {
                let json = await res.json();
                setLoginHelloKryze({
                    loggedIn: true,
                    uuid: json.uuid,
                    username: json.username,
                    email: json.email,
                    kryze: json.uuid === "7e29eb83-45a3-4a0c-ac61-3dc7375ab5ca" || json.username === "xiey0无节操",
                })


            } else {
                localStorage.removeItem("acc");
            }

        }

        f()
    }, [])

    async function UploadEntry() {
        l.add(`Now start uploading: ${form.name}, ${Kind[form.kind]}`)
        if (!form.name || !form.file) {
            setState(1)
            setLoading(false)
            // alert("格式不正确")
            l.add(`驳回。驳回原因：填写名称，上传文件并确保文件格式正确。`)

        } else {
            setLoading(true);
            const reader = new FileReader();
            reader.readAsDataURL(form.file);
            reader.onload = async () => {
                let prep = {
                    name: form.name,
                    albumName: !form.albumName ? null : form.albumName,
                    link: form.link,
                    file: reader.result,
                    email: form.email,
                    artist: !form.artist ? null : form.artist,
                    kind: form.kind,
                    albumCover: !form.albumCover ? null : form.albumCover,


                }
                l.add(`开始上传`);
                let res = await fetch(baseUrl + "submit", {
                    method: 'POST', body: JSON.stringify(prep), headers: {
                        'Content-Type': 'application/json',
                    }, credentials: "include",


                }).catch((e) => {
                    console.log(e)
                    l.add(`错误；错误原因：${e}`)
                    setLoading(false);
                })
                if (res !== undefined) {
                    if(res.status === 503){
                        setLoading(false);
                        setState(503)

                    }else if (res.status === 500) {
                        setLoading(false);
                        setState(2)
                        l.add("重复项。")
                        // alert("傻逼，重复了。请在盲目上传之前看看库里有没有好么傻逼？")
                    } else if (res.ok) {
                        setLoading(false);
                        setState(0)
                        l.add("上传完成。")
                        // alert("上传完成，正在分析，将在5-30分钟内在数据库中出现")
                    } else {
                        setLoading(false);
                        l.add("未知错误。")
                        alert("未知错误")
                    }
                }

            }
        }

    }

    const [searchParam, setSearchParam] = useState("")

    function Banner() {
        switch (state) {
            case -1:
                return null
            case 0:
                return <div className={"alert alert-success"}><strong>上传完成，</strong>正在分析，将在5-30分钟内在数据库中出现
                </div>
            case 1:
                return <div className={"alert alert-warning"}>格式不正确。</div>
            case 2:
                return <div className={"alert alert-danger"}>
                    <strong>和数据库中条目重复</strong></div>
            case 3:
                return <div className={"alert alert-success"}><strong>提交成功！</strong></div>
            case 503:
                return <div className={"alert alert-danger"}>
                    <strong>所有人在五分钟内仅可上传五首歌曲。</strong>
                </div>
            default:
                return null

        }
    }

    return (<>
        <div style={{ backgroundColor: "white" }}>
            {(loginHelloKryze && loginHelloKryze.kryze) || helloKryze === "true" ?
                <div style={{ position: "fixed", zIndex: 1, top: "0" }}>

                    <div style={{ position: "relative", marginTop: 0, width: "100vw", height: "100vh", }}>
                        <Navbar isFixed={false} />
                        <div>
                            <div style={{ position: "absolute" }}>
                                <img src={TF} style={{ width: "5rem" }}></img>

                            </div>
                            <div style={{ position: "absolute", right: 0 }}>
                                <img src={TF} style={{ width: "5rem" }}></img>

                            </div>
                            <div style={{ position: "absolute", bottom: 0 }}>
                                <img src={TF} style={{ width: "5rem" }}></img>

                            </div>
                            <div style={{ position: "absolute", bottom: 0, right: 0 }}>
                                <img src={TF} style={{ width: "5rem" }}></img>

                            </div>
                        </div>

                    </div>

                </div> : <Navbar isFixed={true} />}


            <div className="container  " style={{ paddingTop: "10rem" }}>

                <div className={"head"}
                    style={{ display: "flex", justifyContent: "center", flexDirection: "row", flexWrap: "wrap" }}>


                    <div style={{
                        justifyContent: "center",
                        
                        display: "flex", flexDirection: "column", alignItems: "center"
                    }}>
                        <div className="row">
                            <div className={"display-1 text-lg-center"} style={{ userSelect: "none" }}>
                                {(loginHelloKryze && loginHelloKryze.kryze) || helloKryze === "true" ?
                                    <img src={TF} style={{ width: "10rem" }} className={"mt-5"}></img> : null}


                                <div>
                                    伴奏网
                                </div>
                            </div>
                            <span className={"text-lg-center user-select-none "}
                                style={{ fontSize: ".9rem" }}>AI支持的，免费无登录的伴奏分享网站
                                <div
                                    className={" text-lg-center text-danger text-decoration-underline"}>
                                    本站秉持先搜索，后上传的原则<br/>
                                    <NavLink to={WebRoutes.instruNet + "/announcement"}>公告</NavLink>
                                </div>
                            </span>
                        </div>
                        <div className={"row mt-5"}>
                            <form className={"d-flex w-100"} onSubmit={Prevent}>
                                <input className={"form-control me-2"} type={"text"} placeholder={"搜索"}
                                    onChange={(e) => {
                                        setSearchParam(e.target.value);
                                    }} value={searchParam} onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            setState(-1)
                                            searchGeneral();
                                        }
                                    }} />

                            </form>
                            <Flex id={"double"} style={{ margin: "auto" }} mt={"md"} gap={"lg"} justify="space-evenly">
                                <Button fullWidth={true}
                                    className="btn btn-primary" onClick={() => {
                                        setState(-1)
                                        searchGeneral()
                                    }}>搜索
                                </Button>
                                <Button disabled={true} fullWidth={true} variant={"gradient"}
                                    gradient={{ from: "blue", to: "violet", deg: 45 }}
                                    className="btn btn-primary" onClick={() => {
                                        setState(-1)
                                        searchGeneral()
                                    }}>随机
                                </Button>
                            </Flex>

                        </div>
                    </div>


                </div>

                <div className={"row mt-5"}>
                    <div className={"h4"} style={{
                        color: "darkblue", fontWeight: "lighter"
                    }}>（请登录以获得最佳体验如：歌单功能，记录歌曲上传者……）
                    </div>
                    <div className={"display-4"}>为社区做一点贡献：</div>


                    <div className={"h5 mt-3 "}>别担心，你只需要提供歌曲的源文件和元数据即可。</div>
                    <div className={"h6"}>不会太久。</div>
                    <h6>全程大概5-30分钟左右。</h6>
                </div>
                <div className={"row mt-5  justify-content-center "} style={{ marginBottom: "90px" }}>
                    <Banner />
                    <form className={" px-0"} style={{ width: '80%' }} onSubmit={Prevent}>
                        <div style={{ visibility: loading ? "visible" : "collapse" }}>
                            <span className={"spinner-border"}
                            ></span><span>正在加载</span>

                        </div>

                        <ul className="nav nav-tabs">
                            <li className="nav-item">
                                <a className="nav-link active" data-bs-toggle="tab" href="#file-mode">文件模式</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" data-bs-toggle="tab" href="#ncm-mode">网易云模式</a>
                            </li>

                        </ul>
                        <div className={"tab-content"}>
                            <div className={"tab-pane  active"} id={"file-mode"}>
                                <div className={"mb-3"} style={{
                                    borderWidth: ".5px",
                                    borderColor: "black",
                                    borderStyle: "solid",
                                    width: 200,
                                    height: 200,
                                    backgroundSize: "contain"
                                }} id={"AlbumCover"}>
                                    <input type={"file"}
                                        style={{
                                            height: "100%", width: "100%", color: "transparent", filter: "opacity(0)"
                                        }}
                                        onChange={(e) => {
                                            document.getElementById("AlbumCover").style.backgroundImage = `url(${URL.createObjectURL(e.target.files[0])})`;
                                            const reader = new FileReader();
                                            reader.readAsDataURL(e.target.files[0]);

                                            reader.onload = async () => {
                                                setForm({
                                                    ...form, albumCover: reader.result,
                                                })
                                            }

                                        }} />


                                </div>
                                {/** File Input  */}
                                <input required={true} onChange={(obj) => {
                                    if (obj.target.files[0]) {
                                        parseBlob(obj.target.files[0], {
                                            skipCovers: false,

                                        }).then(data => {
                                            const reader = new FileReader();
                                            reader.readAsDataURL(!data.common.picture ? new Blob([]) : new Blob([selectCover(data.common.picture).data.buffer]))
                                            reader.onload = () => {
                                                /** I really don't know what to do here. Sorry for violating React.*/
                                                /** Jan 09 25 I really should use useState. Fuck me. **/
                                                /** Not too necessary now I think lul 6.13.25 */

                                                /** Album Cover detection + Metadata reader. */
                                                if (data.common.picture) {
                                                    let coverBlob = new Blob([selectCover(data.common.picture).data.buffer])
                                                    document.getElementById("AlbumCover").style.backgroundImage = `url(${URL.createObjectURL(coverBlob)})`;
                                                    setForm({
                                                        ...form,
                                                        name: data.common.title ? data.common.title : null,
                                                        albumName: data.common.album ? data.common.album : null,
                                                        artist: !data.common.artist ? data.common.albumartist ? data.common.albumartist : null : data.common.artist ? data.common.artist : null,
                                                        file: obj.target.files[0],

                                                        albumCover: reader.result,
                                                    })
                                                    l.add(`Album cover setted according to metadata read. \n`+
                                                        `Name setted to: ${data.common.title ? data.common.title : "NULL"} according to metadata read. \n`+
                                                        `Album name setted to: ${data.common.album ? data.common.album : "NULL"} according to metadata read. \n`+
                                                    `Artist setted to: ${data.common.artist} or ${data.common.albumartist} or NULL according to metadata read. Unfortunately due to code architecture, we cannot know. `); 
                                                    
                                                    
                                                } else {
                                                    document.getElementById("AlbumCover").style.backgroundImage = ``;

                                                    setForm({
                                                        ...form,
                                                        name: data.common.title ? data.common.title : "",
                                                        albumName: data.common.album ? data.common.album : "",
                                                        artist: !data.common.artist ? data.common.albumartist ? data.common.albumartist : "" : data.common.artist ? data.common.artist : "",
                                                        file: obj.target.files[0],
                                                        albumCover: ""
                                                    })
                                                    l.add(`Album cover setted according to metadata read. \n`+
                                                        `Name setted to: ${data.common.title ? data.common.title : "NULL"} according to metadata read. \n`+
                                                        `Album name setted to: ${data.common.album ? data.common.album : "NULL"} according to metadata read. \n`+
                                                    `Artist setted to: ${data.common.artist} or ${data.common.albumartist} or NULL according to metadata read. Unfortunately due to code architecture, we cannot know. `); 
                                                }
                                            }


                                        })
                                    }


                                }} className={"mb-3 form-control"} type={"file"} name={"file"} accept={"audio/*"}
                                ></input>
                                <input required={true} value={form.name} onChange={(obj) => {
                                    setForm({
                                        ...form, name: obj.target.value,
                                    });
                                    l.add(`Name setted to: ${obj.target.value}`, true); 
                                }} className={" mb-3 form-control"} placeholder={"曲目名"} name={"name"} />
                                <input onChange={(obj) => {
                                    setForm({
                                        ...form, albumName: obj.target.value
                                    });
                                    l.add(`Album setted to: ${obj.target.value}`,true); 
                                }} value={form.albumName} className={"  mb-3 form-control"} placeholder={"所属专辑名"}
                                    name={"albumName"} />
                                <input onChange={(obj) => {
                                    setForm({
                                        ...form, artist: obj.target.value
                                    })
                                    l.add(`Artist setted to: ${obj.target.value}`,true)
                                }} placeholder={"歌手名"} className={"mb-3 form-control"} value={form.artist} />

                                <input onChange={(obj) => {
                                    setForm({
                                        ...form, email: obj.target.value
                                    })
                                    setCookie("email", obj.target.value, {
                                        sameSite: "strict",
                                    })
                                    l.add(`Email setted to: ${obj.target.value}`, true)
                                }} value={form.email} className={"mb-3 form-control"}
                                    placeholder={"邮箱（通知何时完毕，可选）"} type="email"
                                />
                                <div className={"row mb-3"}>
                                    <div className={"col-lg-2 w-auto"}>
                                        <Flex wrap={"wrap"}>
                                            {/*{Kind.map((val, index) => <div key={index}*/}
                                            {/*    style={{*/}
                                            {/*        width: "100%",*/}
                                            {/*        marginBottom: "1rem"*/}
                                            {/*    }}>*/}
                                            {/*    <Switch label={val} value={index} onChange={(event) => {*/}
                                            {/*        if (event.target.checked) {*/}
                                            {/*            console.log("selected")*/}
                                            {/*            setForm({*/}
                                            {/*                ...form, kind: (() => {*/}
                                            {/*                    let newArray = form.kind;*/}
                                            {/*                    newArray.push(Number(event.target.value));*/}
                                            {/*                    newArray.sort();*/}
                                            {/*                    console.log(newArray);*/}
                                            {/*                    return newArray;*/}
                                            {/*                })()*/}
                                            {/*            })*/}
                                            {/*        } else {*/}
                                            {/*            console.log("deselected")*/}
                                            {/*            setForm({*/}
                                            {/*                ...form, kind: (() => {*/}
                                            {/*                    let newArray = [];*/}
                                            {/*                    for (let x of form.kind) {*/}
                                            {/*                        if (x !== Number(event.target.value)) {*/}
                                            {/*                            newArray.push(x);*/}
                                            {/*                        }*/}
                                            {/*                    }*/}
                                            {/*                    newArray.sort();*/}
                                            {/*                    console.log(newArray)*/}
                                            {/*                    return newArray;*/}
                                            {/*                })()*/}
                                            {/*            })*/}
                                            {/*        }*/}

                                            {/*    }}></Switch>*/}


                                            {/*</div>)}*/}
                                            <select name={"mode"} onChange={(e) => {
                                                setForm({
                                                    ...form, kind: [Number.parseInt(e.target.value)]
                                                })

                                            }} className={"form-control form-select"} style={{userSelect: "none"}}>

                                                {Kind.map((val, index) =>
                                                    <option key={index} value={index}>{val}</option>
                                                )}


                                            </select>
                                        </Flex>


                                    </div>

                                </div>


                                <button className={"btn btn-primary mb-3 w-100"} type={"submit"} onClick={async () => {
                                    setState(-1)
                                    await UploadEntry()
                                }}
                                    disabled={loading}><i
                                        className={"bi-upload"}></i> 上传
                                </button>
                            </div>
                            <div className={"tab-pane"} id={"ncm-mode"}>

                                <input type={"text"} placeholder={"歌曲ID（网易云网页端地址中“id”参数）"}
                                    className={"mb-3 mt-3 form-control "} value={ncmForm.id} onInput={(e) => {
                                        setncmForm({
                                            ...ncmForm, id: e.currentTarget.value,

                                        })
                                    }} />
                                <a href={"https://www.bilibili.com/video/BV1Buc8eGEmh/?share_source=copy_web&vd_source=fff871e844f34f38697fc936b8301df5&t=49"}>如何寻找？</a>
                                <input onChange={(obj) => {
                                    setncmForm({
                                        ...ncmForm, email: obj.target.value,
                                    })
                                    setCookie("email", obj.target.value, {
                                        sameSite: "strict",
                                    })
                                }} value={ncmForm.email} className={"mb-3 form-control"}
                                    placeholder={"邮箱（通知何时完毕，可选）"} type="email"
                                />
                                <div className={"row mb-3"}>
                                    <div className={"col-lg-2 w-auto"}>
                                        <Flex wrap={"wrap"}>
                                            {/*{Kind.map((val, index) => <div key={index}*/}
                                            {/*    style={{*/}
                                            {/*        width: "100%",*/}
                                            {/*        marginBottom: "1rem"*/}
                                            {/*    }}>*/}
                                            {/*    <Switch label={val} value={index} onChange={(event) => {*/}
                                            {/*        if (event.target.checked) {*/}
                                            {/*            console.log("selected")*/}
                                            {/*            setncmForm({*/}
                                            {/*                ...ncmForm, kind: (() => {*/}
                                            {/*                    let newArray = ncmForm.kind;*/}
                                            {/*                    newArray.push(Number(event.target.value));*/}
                                            {/*                    newArray.sort();*/}
                                            {/*                    console.log(newArray);*/}
                                            {/*                    return newArray;*/}
                                            {/*                })()*/}
                                            {/*            })*/}
                                            {/*        } else {*/}
                                            {/*            console.log("deselected")*/}
                                            {/*            setncmForm({*/}
                                            {/*                ...ncmForm, kind: (() => {*/}
                                            {/*                    let newArray = [];*/}
                                            {/*                    for (let x of ncmForm.kind) {*/}
                                            {/*                        if (x !== Number(event.target.value)) {*/}
                                            {/*                            newArray.push(x);*/}
                                            {/*                        }*/}
                                            {/*                    }*/}
                                            {/*                    newArray.sort();*/}
                                            {/*                    console.log(newArray)*/}
                                            {/*                    return newArray;*/}
                                            {/*                })()*/}
                                            {/*            })*/}
                                            {/*        }*/}

                                            {/*    }}></Switch>*/}


                                            {/*</div>)}*/}
                                            <select name={"mode"} onChange={(e) => {
                                                console.log(e.target.value);
                                                setncmForm({
                                                    ...ncmForm, kind: [Number.parseInt(e.target.value)]
                                                })
                                                console.log(form);
                                            }} className={"form-control form-select"} style={{userSelect: "none"}}>

                                                {Kind.map((val, index) =>
                                                    <option key={index} value={index}>{val}</option>
                                                )}


                                            </select>
                                        </Flex>
                                    </div>

                                </div>
                                <button className={"btn btn-primary w-100"} onClick={async (e) => {
                                    setState(-1)
                                    setLoading(true);
                                    e.currentTarget.disabled = true;
                                    let res = (await fetch(baseUrl + "ncm/url", {
                                        method: "POST", body: JSON.stringify({
                                            id: ncmForm.id, kind: ncmForm.kind, email: ncmForm.email,
                                        }), credentials: "include", headers: { "Content-Type": "application/json" }
                                    }))
                                    if (res.ok) {
                                        setState(3)
                                        // alert("提交成功")
                                    } else {
                                        alert(await res.text())
                                    }
                                    e.target.disabled = false;

                                    setLoading(false);
                                }}>提交
                                </button>
                            </div>


                        </div>
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />

                    </form>


                </div>

            </div>
        </div>

    </>
    );
}

export default App;
export { Navbar }
