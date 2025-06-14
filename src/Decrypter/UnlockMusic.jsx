import { Button, Container } from "@mantine/core";
import { useState } from "react";
import { fetchUrl } from "../Singletons";

function UnlockMusic() {
    const [file, setFile] = useState({
        fileInDataUri: null,
        fileName: null
    })
    return <>
        <Container>
            <div className="display-1 pt-5">音乐解锁</div>
            <div>Powered by: <a href="https://git.unlock-music.dev/um/web">Unlock Music 项目</a></div>
            <div>状态：<div id="status"></div></div>
            <input className="form-control" id="file_input" type="file" name="file" onChange={(e) => {
                document.getElementById("status").innerText = "加载中"
                e.target.disabled = true;
                document.getElementById("button_upload").disabled = true;
                const fs = new FileReader();
                fs.readAsDataURL(e.currentTarget.files[0])
                fs.onloadend = () => {
                    setFile({ fileName: e.target.files[0].name, fileInDataUri: fs.result })
                    e.target.disabled = false;
                    document.getElementById("button_upload").disabled = false;

                }
                document.getElementById("status").innerText = "加载完成"


            }}></input>
            <Button className="mt-3" fullWidth={true} id="button_upload" onClick={async (e) => {
                try {
                    document.getElementById("status").innerText = "上传中"

                    document.getElementById("button_upload").disabled = true;
                    document.getElementById("file_input").disabled = true;
                    let f = await fetch(fetchUrl + "api/decrypter/decryptersubmit", {
                        method: "POST", body: JSON.stringify(file), headers: {
                            "Content-Type": "application/json"
                        }
                    })
                    if (f.ok) {
                        document.getElementById("status").innerText = "转换成功 等待下载……"

                        let r = await f.json();
                        const a = document.createElement('a');
                        a.setAttribute('download', r.fileName);
                        a.setAttribute('href', r.data);
                        a.click();
                        document.getElementById("button_upload").disabled = false;
                        document.getElementById("file_input").disabled = false;
                    } else {
                        document.getElementById("status").innerText = "失败：" + f.status

                        document.getElementById("button_upload").disabled = false;
                        document.getElementById("file_input").disabled = false;
                    }
                } catch (e) {
                    document.getElementById("status").innerText = "失败：" + e

                    document.getElementById("button_upload").disabled = false;
                    document.getElementById("file_input").disabled = false;
                }

            }}>上传</Button>
        </Container>
    </>
}

export default UnlockMusic;