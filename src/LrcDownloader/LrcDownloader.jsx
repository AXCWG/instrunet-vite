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

    const [entries, setEntries] = useState([]);
    const [listIndex, setListIndex] = useState(0);

    const [search, setSearch] = useState("");
    useEffect(()=>{
        console.log(search, listIndex);
    }, [search, listIndex]);
    return <div className={"container"}>
        <NavLink to={"/"} style={{marginBottom: "2em", marginTop: "2em",  display: "block"}}>返回</NavLink>
        <div className={"display-1"} style={{marginBottom: "1em"}}>批量歌词下载器</div>
        <div className={"row g-4"}>

            <div className={"col-sm-6"} style={{}}>
                <div style={{display: "flex", gap: "5px"}}>
                    <Input value={search} onChange={(e)=>{
                        setSearch(e.target.value);
                    }} style={{marginBottom: "1rem", flexGrow: "1"}} placeholder={"搜索……"} />
                    <Button onClick={async (e)=>{
                        let target = e.currentTarget;
                        target.disabled = true;
                        let r = await (await fetch(fetchUrl+ "lyric", {
                            method: "POST",
                            body: JSON.stringify({
                                name: search, artist: "", albumName: ""
                            }),
                            headers: {
                                "Content-Type": "application/json",
                            }
                        }))
                        if(r.status === 200){
                            let rJ = await r.json();
                            setEntries([...entries, {name: search, content: rJ}]);
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
                            return <TableTr key={index} onClick={()=>{
                                setListIndex(index);
                            }}>
                                <TableTd>{entry.name}</TableTd>

                            </TableTr>

                        })}

                    </TableTbody>

                </Table>
            </div>
            <div className={"col-sm-6 "} style={{display: "flex", flexDirection: "column"}} >
                <NativeSelect>
                    <option></option>

                </NativeSelect>
                <div className={"rounded-1 "} style={{flexGrow: 1,  borderStyle: "solid", borderWidth: ".5px", borderColor: "gray"}}>
                    <TextWindow>
                        www
                    </TextWindow>
                </div>


            </div>
        </div>
    </div>


}

// eslint-disable-next-line react/prop-types
function TextWindow({children}) {
    return <div className={"p-2"}>{children}</div>
}

export default LrcDownloader;