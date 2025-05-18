import {Navbar} from "./App.jsx";
import {useEffect, useState} from "react";
import {fetchUrl, Kind} from "./Singletons.js";

function Query() {
    const [query, setQuery] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function f() {
            setQuery(await (await fetch(fetchUrl + "queue")).json())
            setLoading(false);
        }

        f()
    }, [])
    return (
        <>
            <Navbar/>
            <div className="container">
                <div className="row">
                    <table className="table table-striped mt-4 table-bordered">
                        <thead>
                        <tr>
                            <td>
                                曲名
                            </td>
                            <td>专辑名</td>
                            <td>创作者</td>
                            <td>类别</td>
                            <td>状态</td>
                        </tr>
                        </thead>
                        <tbody>

                        {loading ? <tr>
                            <td colSpan={5} className={"text-center"}>正在加载</td>
                        </tr> : query.length !== 0 ? query.map((item, index) => {

                            if (index === 0) {
                                return (
                                    <tr key={index} className="table-success">
                                        <td>{item.name}</td>
                                        <td>{item.albumName}</td>
                                        <td>{item.artist}</td>
                                        <td>{Kind[item.kind]}</td>
                                        <td>正在处理</td>
                                    </tr>
                                )
                            } else {
                                return (
                                    <tr key={index}>
                                        <td>{item.name}</td>
                                        <td>{item.albumName}</td>
                                        <td>{item.artist}</td>
                                        <td>{Kind[item.kind]}</td>
                                        <td>队列中</td>
                                    </tr>
                                )
                            }
                        }) : <tr>
                            <td colSpan={5} className={"text-center"}>空</td>
                        </tr>}

                        </tbody>

                    </table>
                </div>

            </div>


        </>


    )
}

export default Query;