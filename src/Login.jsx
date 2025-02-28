import {fetchUrl} from "./Singletons";
import {useState} from "react";
import {Alert} from "@mantine/core";

function Login() {
    const [state, setState] = useState(0)
    async function login(username, password) {
        let response = await fetch(fetchUrl + "login", {
            method: "POST",
            body: JSON.stringify({username, password}),
            headers: {"Accept": "application/json", "Content-Type": "application/json"},credentials: "include"
        })
        if (response.ok) {
            // alert("登录成功，正在为您返回主界面……")
            setState(1)
            setInterval(() => {
                window.location.href = "/";
            }, 500)
        } else {
            setState(-1)
        }
    }

    return (
        <>
            <div className={"container mt-5"}>
                <div className={"row"}>

                    <div className={"col-2"}></div>
                    <form className={"col-8"} onSubmit={async (e) => {
                        e.preventDefault();
                        await login(e.target[0].value, e.target[1].value)

                    }}>
                        <div className={"h5 user-select-none"}>伴奏网</div>
                        <div className={"display-2 user-select-none"}>登录</div>
                        {state === 1 ? <Alert variant={"light"} color={"green"} title={"登录成功！"}>正在前往上一页……</Alert> : state===-1 ? <Alert variant={"light"} color={"red"} title={"登录失败"}>用户名或密码错误</Alert> : null}
                        <input required={true} className={"form-control mt-4"} placeholder={"用户名"}
                               autoComplete={"username"}></input>
                        <input required={true} className={"form-control mt-4"} placeholder={"密码"} type={"password"}
                               autoComplete={"current-password"}></input>
                        <button type={"submit"} className={"btn btn-primary mt-4 w-100"}>登录</button>
                    </form>

                    <div className={"col-2"}></div>
                </div>

            </div>

        </>
    )
}

export default Login;