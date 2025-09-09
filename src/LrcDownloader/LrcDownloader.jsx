import {
    Button,
    Input,
    NativeSelect,
    Table,
    TableTbody,
    TableTd,
    TableThead,
    TableTr
} from "@mantine/core";
import {useEffect, useState} from "react";
import {NavLink} from "react-router-dom";
import {fetchUrl} from "../Singletons.js";

function LrcDownloader() {

    /**
     * Types:
     * entries: for controlling the list content on the left.
     * data structure:
     *
     *  entries: {
     *      name: string,
     *      content: Array {
     *          album: string,
     *          title: string,
     *          ...
     *      },
     *      lrcSelectIndex: number
     *  }
     *
     *  listIndex: for controlling the list index on the left.
     *  search: Search box.
     *
     * **/
    const [entries, setEntries] = useState([]);
    const [listIndex, setListIndex] = useState(0);

    const [search, setSearch] = useState("");
    useEffect(() => {
        console.log(search, listIndex);
    }, [search, listIndex]);
    return <div className={"container"}>
        <NavLink to={"/"} style={{marginBottom: "2em", marginTop: "2em", display: "block"}}>返回</NavLink>
        <div className={"display-1"} style={{marginBottom: "1em"}}>批量歌词下载器</div>
        <div className={"row g-4"}>

            <div className={"col-sm-6"} style={{}}>
                <div style={{display: "flex", gap: "5px"}}>
                    <Input value={search} onChange={(e) => {
                        setSearch(e.target.value);
                    }} style={{marginBottom: "1rem", flexGrow: "1"}} placeholder={"搜索……"}/>
                    <Button onClick={async (e) => {
                        if (!search) {
                            alert("请输入内容")
                            return;
                        }
                        let target = e.currentTarget;
                        target.disabled = true;
                        let r = await (await fetch(fetchUrl + "lyric", {
                            method: "POST",
                            body: JSON.stringify({
                                name: search, artist: "", albumName: ""
                            }),
                            headers: {
                                "Content-Type": "application/json",
                            }
                        }))
                        if (r.status === 200) {
                            let rJ = await r.json();
                            setEntries([...entries, {name: search, content: rJ, lrcSelectIndex: 0}]);
                            setSearch("");
                        }
                        target.disabled = false;


                    }}><i className={"bi-search"}></i></Button>
                </div>
                <Table striped={true} withTableBorder={true} style={{width: "100%"}}>
                    <TableThead>
                        <TableTr>
                            <TableTd>
                                歌名
                            </TableTd>

                        </TableTr>
                    </TableThead>
                    <TableTbody>
                        {entries.map((entry, index) => {
                            return <TableTr key={index} onClick={() => {
                                setListIndex(index);
                            }}>
                                <TableTd>{entry.name}</TableTd>

                            </TableTr>

                        })}

                    </TableTbody>

                </Table>
            </div>
            <div className={"col-sm-6 "} style={{display: "flex", flexDirection: "column"}}>
                {
                    entries.map((entry, index) => {
                        return <RightSide key={index} index={index} listIndex={listIndex} entries={entries} />
                    })
                }



            </div>
        </div>
    </div>


}

// eslint-disable-next-line react/prop-types
function TextWindow({children}) {
    return <div className={"p-2"}>{children}</div>
}
// eslint-disable-next-line react/prop-types
function RightSide({index, listIndex, entries}){
    const [lrcIndex, setLrcIndex] = useState(0);
    return <>
        <div key={index} style={{display: index !== listIndex  ? "none" : "block"}}>
            <NativeSelect index={0} onChange={(e) => {
                setLrcIndex(e.target.selectedIndex);

            }}>
                {/* eslint-disable-next-line react/prop-types */}
                {entries.length !== 0 && entries[listIndex] && entries[listIndex].content.length !== 0 ?

                    // eslint-disable-next-line react/prop-types
                    entries[listIndex].content.map((entry, index) => {
                        return <option key={index}>{entry.title} - {entry.album}</option>
                    })

                    : null}
            </NativeSelect>
            <div className={"rounded-1 "}
                 style={{flexGrow: 1, borderStyle: "solid", borderWidth: ".5px", borderColor: "gray"}}>
                <TextWindow>
                    {
                        // eslint-disable-next-line react/prop-types
                        entries.length && entries[listIndex] && entries[listIndex].content && entries[listIndex].content.length
                            // eslint-disable-next-line react/prop-types
                            ? entries[listIndex].content[lrcIndex].lyrics
                            : null
                    }
                </TextWindow>
            </div>
        </div>

    </>
}

export default LrcDownloader;