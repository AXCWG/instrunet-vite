import {useEffect, useState} from "react";
import {fetchUrl} from "./Singletons.js";

function Pitched() {
    const urlParams = new URLSearchParams(window.location.search);
    let param = urlParams.get('id');
    const [info, setInfo] = useState({
        song_name: "",
        album_name: "",
        artist: ""
    });
    const [pitch, setPitch] = useState(0)
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        async function f() {
            let json = await (await fetch(fetchUrl + "getSingle?id=" + param)).json()
            setInfo({
                song_name: json.song_name,
                album_name: json.album_name,
                artist: json.artist,
            })

        }

        f()
    }, [param])
    return (
        <>
            <div className="container mt-5 mx-auto" style={{
                maxWidth: "900px"
            }}>
                <div className={"display-3"}>升降调下载</div>
                <div className={"mt-5 display-6"}>当前选择曲目：</div>
                <div className={"mt-3"}>{info.song_name}</div>
                <div className={"mt-3 display-6"}>创作者</div>
                <div className={"mt-3"}>{info.artist}</div>
                <div className={"mt-5"}>当前选择：{pitch}</div>
                <div className={"alert alert-warning mt-3"}><strong>注意</strong> 这个过程很慢，请耐心等待</div>
                {
                    loading ? <div className="spinner-border"></div> : null

                }
                <input className={"w-100 mt-3 form-range"} type={"range"} min={-8} max={8}
                       value={pitch}
                       step={0.5} onChange={(e) => {
                    console.log(e.target.value)
                    setPitch(Number(e.target.value))
                }}></input>
                <button className={"w-100 mt-3 btn btn-primary"} onClick={async (e) => {
                    // This is possibly the worst way to do this for the love of god.
                    // Plus the worst thing I've ever done in my career.
                    setLoading(true);
                    const table = {
                        "8": "0.5",
                        "7.5": "0.53125",
                        "7": "0.5625",
                        "6.5": "0.59375",
                        "6": "0.625",
                        "5.5": "0.65625",
                        "5": "0.6875",
                        "4.5": "0.71875",
                        "4": "0.75",
                        "3.5": "0.78125",
                        "3": "0.8125",
                        "2.5": "0.84375",
                        "2": "0.875",
                        "1.5": "0.90625",
                        "1": "0.9375",
                        "0.5": "0.96875",
                        "0": "1",
                        "-0.5": "1.03125",
                        "-1": "1.0625",
                        "-1.5": "1.09375",
                        "-2": "1.125",
                        "-2.5": "1.15625",
                        "-3": "1.1875",
                        "-3.5": "1.21875",
                        "-4": "1.25",
                        "-4.5": "1.28125",
                        "-5": "1.3125",
                        "-5.5": "1.34375",
                        "-6": "1.375",
                        "-6.5": "1.40625",
                        "-7": "1.4375",
                        "-7.5": "1.46875",
                        "-8": "1.5",

                    }
                    e.currentTarget.disabled = true;

                    let url = URL.createObjectURL(new Blob([await (await fetch(fetchUrl + param + "?pitch=" + table[pitch.toString()])).arrayBuffer()]))

                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute(
                        'download',
                        `${info.song_name}.wav`,
                    );

                    // Append to html link element page
                    document.body.appendChild(link);

                    // Start download
                    link.click();

                    // Clean up and remove the link
                    link.parentNode.removeChild(link);
                    setLoading(false);
                }}>下载
                </button>
            </div>
        </>
    )
}

export default Pitched