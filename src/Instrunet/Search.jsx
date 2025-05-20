import './App.css'
import {useEffect, useState} from "react";
import {baseUrl, Kind, WebRoutes} from "../Singletons.js";
import {Navbar} from "./App.jsx";

const queryParams = new URLSearchParams(window.location.search);
const p = queryParams.get("p");


function Cards({data}) {

    return (
        <>

            <div className={"col-lg-6 mb-3"}>
                <div className={"card cards"} style={{width: "100%"}} onClick={(e) => {
                    window.location.href = WebRoutes.instruNet + "/player?play=" + data.uuid;
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
    useEffect(() => {
        async function f() {
            setGot_data(await (await fetch(baseUrl + "search_api", {
                method: "POST",
                body: JSON.stringify({searchStr: p === null ? "" : p}), headers: {'Content-Type': 'application/json'}
            })).json())
            setLoading(false);
        }

        f()
    }, [])
    const [selected, setSelected] = useState( localStorage.getItem("selected") ? JSON.parse(localStorage.getItem("selected")) : [
        true,
        true,
        true,
        true,
        true,
        true, true
    ])

    return (
        <>
            <Navbar isFixed={true}/>
            <div className="container" style={{marginTop: "5rem"}}>
                <div className={"display-1 user-select-none"}>
                    搜索结果：{p === "" || p === null ? "全部" : p}
                </div>
                <div className={"row mt-3"}>
                    {Kind.map((value, index) => (
                        <div key={index} id={index + "d"}>
                            <input checked={selected[index]} onChange={() => {
                                setSelected((sel) => {

                                    localStorage.setItem("selected", JSON.stringify(sel.with(index, !sel[index])));

                                    return sel.with(index, !sel[index])
                                });

                            }} type={"checkbox"} id={index} className={"form-check-input"}/>
                            <label id={index + "l"} htmlFor={index} style={{userSelect: "none"}}>{<div
                                id={index + "s"}>{Kind[index]}</div>}</label>
                        </div>
                    ))}


                </div>
                <div className={"mt-5 row"}>
                    {
                        loading ? <div style={{alignItems: "center"}}>
                            <span className={"spinner-border"}
                            ></span><span>正在加载</span>

                            </div> :
                            got_data.map((data, up) => {
                                if (
                                    data.song_name === "form.name"
                                ) {
                                    return null
                                }
                                for(let i in selected) {

                                    if (selected[i] === true) {
                                        if (data.kind === Number(i)) {
                                            return (
                                                <Cards key={up} data={data}/>
                                            )
                                        }

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