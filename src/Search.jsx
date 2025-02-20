import './App.css'
import {useEffect, useState} from "react";
import {baseUrl, Kind} from "./Singletons.js";
import {Navbar} from "./App.jsx";

const queryParams = new URLSearchParams(window.location.search);
const p = queryParams.get("p");


function Cards({data}) {

    return (
        <>

            <div className={"col-lg-6 mb-3"} >
                <div className={"card cards"} style={{width: "100%"}} onClick={(e) => {
                    window.location.href = "/player?play=" + data.uuid;
                }}>
                    <div className={"card-body"}>
                        <div className={"display-6 text-wrap"}>
                            {data.song_name}

                        </div>
                    </div>
                    <div className={"card-footer"}>
                        {data.artist} - {data.album_name} - {Kind[data.kind]}
                    </div>
                </div>
            </div>
        </>
        )
}

function Search() {
    const [got_data, setGot_data] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(()=>{
        async function f(){
            setGot_data(await (await fetch(baseUrl + "search_api", {
                method: "POST",
                body: JSON.stringify({searchStr: p === null ? "" : p}), headers: {'Content-Type': 'application/json'}
            })).json())
            setLoading(false);
        }
        f()
    }, [])
    const [selected, setSelected] = useState({
        0: true,
        1: true,
        2: true,
        3: true,
        4: true,
        5:true
    })
    return (
        <>
            <Navbar isFixed={true}/>
            <div className="container" style={{marginTop: "5rem"}}>
                <div className={"display-1 user-select-none"}>
                    搜索结果：{p === "" || p === null ? "全部" : p}
                </div>
                <div className={"row mt-3"}>
                    <div id={"0d"}>
                        <input checked={selected["0"]} onChange={(e) => {
                            setSelected({...selected, 0: !selected["0"]});
                        }} type={"checkbox"} id={"0"} className={"form-check-input"}/>
                        <label id={"0l"} htmlFor={"0"} style={{userSelect: "none"}}>{<div
                            id={"0s"}>{Kind["0"]}</div>}</label>
                    </div>
                    <div id={"1d"}>
                        <input checked={selected["1"]} onChange={(e) => {
                            setSelected({...selected, 1: !selected["1"]});
                        }} type={"checkbox"} id={"1"} className={"form-check-input"}/>
                        <label id={"1l"} htmlFor={"1"} style={{userSelect: "none"}}>{<div
                            id={"1s"}>{Kind["1"]}</div>}</label>
                    </div>
                    <div id={"2d"}>
                        <input checked={selected["2"]} onChange={(e) => {
                            setSelected({...selected, 2: !selected["2"]});
                        }} type={"checkbox"} id={"2"} className={"form-check-input"}/>
                        <label id={"2l"} htmlFor={"2"} style={{userSelect: "none"}}>{<div
                            id={"2s"}>{Kind["2"]}</div>}</label>
                    </div>
                    <div id={"3d"}>
                        <input checked={selected["3"]} onChange={(e) => {
                            setSelected({...selected, 3: !selected["3"]});
                        }} type={"checkbox"} id={"3"} className={"form-check-input"}/>
                        <label id={"3l"} htmlFor={"3"} style={{userSelect: "none"}}>{<div
                            id={"3s"}>{Kind["3"]}</div>}</label>
                    </div>
                    <div id={"4d"}>
                        <input checked={selected["4"]} onChange={(e) => {
                            setSelected({...selected, 4: !selected["4"]});
                        }} type={"checkbox"} id={"4"} className={"form-check-input"}/>
                        <label id={"4l"} htmlFor={"4"} style={{userSelect: "none"}}>{<div
                            id={"4s"}>{Kind["4"]}</div>}</label>
                    </div>
                    <div id={"5d"}>
                        <input checked={selected["5"]} onChange={(e) => {
                            setSelected({...selected, 5: !selected["5"]});
                        }} type={"checkbox"} id={"5"} className={"form-check-input"}/>
                        <label id={"5l"} htmlFor={"5"} style={{userSelect: "none"}}>{<div
                            id={"5s"}>{Kind["5"]}</div>}</label>
                    </div>


                </div>
                <div className={"mt-5 row"}>
                    {
                        loading ? <div style={{alignItems: "center"}}>
                            <span className={"spinner-border"}
                            ></span><span>正在加载</span>

                            </div> :
                            got_data.map((data) => {
                                if (
                                    data.song_name === "form.name"
                                ) {
                                    return null
                                }
                                if (selected["0"] === true) {
                                    if (data.kind === 0) {
                                        return (
                                            <Cards data={data}/>
                                        )
                                    }

                                }
                                if (selected["1"] === true) {
                                    if (data.kind === 1) {
                                        return (
                                            <Cards data={data}/>
                                        )
                                    }
                                }
                                if (selected["2"] === true) {
                                    if (data.kind === 2) {
                                        return (
                                            <Cards data={data}/>
                                        )
                                    }
                                }
                                if (selected["3"] === true) {
                                    if (data.kind === 3) {
                                        return (
                                            <Cards data={data}/>
                                        )
                                    }
                                }
                                if (selected["4"] === true) {
                                    if (data.kind === 4) {
                                        return (
                                            <Cards data={data}/>
                                        )
                                    }
                                }
                                if (selected["5"] === true) {
                                    if (data.kind === 5) {
                                        return (
                                            <Cards data={data}/>
                                        )
                                    }
                                }
                                return null


                            })


                    }
                </div>


            </div>
        </>

    )
}

export default Search;