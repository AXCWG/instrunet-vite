import {
    Button,
    FileInput,
    Loader,
    Switch,
    Table,
    TableTbody, TableTd, TableTr,
    TextInput
} from "@mantine/core";
import {fetchUrl, Languages, readAsDataUrlAsync} from "../Singletons.js";
import {useEffect, useState} from "react";

function SttIndex() {
    const [form, setForm] = useState({
        file: undefined, language: 0, email: "", completeSentence: false
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
            <div className={"mb-5 mt-5"}>
                <a href={"/"}>返回</a>
                <div className={"display-3 "}>语音转文字</div>
                <div>不要尝试放音乐进去：通常结果不会太好😂</div>
            </div>

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
                    console.log(e)
                    setForm({
                        ...form, file: await (async () => {
                            return await readAsDataUrlAsync(e)
                        })()
                    });
                }} id={"file-input"} placeholder={"点击选择"}/>
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
                <Switch label={"尽量保持句子完整性"} checked={form.completeSentence}  onChange={(e) => {
                    console.log(e.currentTarget.checked);
                    setForm({...form, completeSentence: e.currentTarget.checked});
                }}/>
                <br/>
                <Button type={"submit"} fullWidth={true} disabled={pageState === 3}>上传</Button>
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