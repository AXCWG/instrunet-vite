import {
    Button,
    FileInput,
    Input,
    Loader,
    MultiSelect,
    Select,
    Table,
    TableTbody, TableTd, TableTh, TableThead,
    TableTr,
    TextInput
} from "@mantine/core";
import {fetchUrl, Languages, readAsDataUrlAsync} from "../Singletons.js";
import {useEffect, useState} from "react";

function SttIndex() {
    const [form, setForm] = useState({
        file: undefined, language: 0, email: ""
    })

    const [queueInfo, setQueueInfo] = useState([])
    useEffect(() => {
        fetch(fetchUrl + "api/sttprocessing/queuestt").then(res => {
            res.json().then(data => {
                setQueueInfo(data)
            })
        })
    }, []);
    const [pageState, setPageState] = useState(0)
    const [errorMessage, setErrorMessage] = useState("")
    return <>
        <div className={"container"}>
            <div className={"display-4 mb-5"}>正经的UI正在加急中</div>
            {
                pageState === 1 ? <div className={"alert alert-success"}>成功</div> : pageState === 2 ?
                    <div className={"alert alert-danger"}>未上传文件</div> : pageState === 3 ?
                        <Loader></Loader> : pageState === 4 ?
                            <div className={"alert alert-danger"}>失败：{errorMessage}</div> : null
            }
            <form onSubmit={async e => {
                e.preventDefault()
                setPageState(3)
                console.log(form)
                if (!form.file) {
                    setPageState(2)
                    return;
                }
                const res = await fetch(fetchUrl + "api/sttprocessing/upload", {
                    method: "POST",
                    body: JSON.stringify(form),
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                if (res.ok) {
                    setPageState(1)

                } else {
                    setPageState(4)
                    setErrorMessage(await res.text())
                }

            }}>
                <label htmlFor={"file-input"}>选择音频文件：</label>
                <FileInput accept={"audio/*"} onChange={async (e) => {
                    setForm({
                        ...form, file: await (async () => {
                            return await readAsDataUrlAsync(e)
                        })()
                    });
                }} id={"file-input"} placeholder={"点击选择或拖拽"}/>
                <br/>
                <TextInput id={"email-input"} type={"email"} value={form.email} onChange={(e) => {
                    setForm({...form, email: e.target.value});
                }}
                           placeholder={"电子邮箱（必须，结果将发送至邮箱中）"} required={true}/>
                <br/>
                <select className={"form-select"} required={true} id={"language-select"} onChange={(e) => {
                    setForm({...form, language: Number(e.target.value)});

                }}>
                    {
                        Languages.map((language, index) => <option key={index} value={index}>{language}</option>)
                    }
                </select>


                <br/>
                <Button type={"submit"} fullWidth={true}>上传</Button>
                <br/>
                <br/>

            </form>
            <Table striped={true} withTableBorder={true}>
                <Table.Thead>

                    <Table.Tr>
                        <Table.Th>
                            电邮
                        </Table.Th>
                        <Table.Th>

                            时间
                        </Table.Th>
                        <Table.Th>
                            语言
                        </Table.Th>
                    </Table.Tr>

                </Table.Thead>


                <TableTbody>
                    {
                        queueInfo.map((item, index) => {
                            return <>
                                <TableTr>
                                    <TableTd>{item.email}</TableTd>
                                    <TableTd>{item.dateTime}</TableTd>
                                    <TableTd>{item.language}</TableTd>
                                </TableTr>
                            </>
                        })
                    }
                </TableTbody>
            </Table>
        </div>
    </>
}

export default SttIndex;