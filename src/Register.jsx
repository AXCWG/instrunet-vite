import {fetchUrl} from "./Singletons";

function Register() {
    async function register(email, username, password) {
        let response = await fetch(fetchUrl + "register", {
            method: "POST",
            body: JSON.stringify({email, username, password}),
            headers: {"Accept": "application/json", "Content-Type": "application/json"},credentials: "include"
        })
        if (response.ok) {
            alert("注册成功，正在为您返回主界面……")
            window.location.href = "/"
        } else {
            alert("错误")
        }
    }
    return <>
        <div className={"container mt-5"}>
            <div className={"row"}>

                <div className={"col-2"}></div>
                <div className={"col-8"}>
                    <div className={"h5"}>伴奏网</div>
                    <div className={"display-2"}>注册</div>
                    <form onSubmit={async (e)=>{
                        e.preventDefault();
                        if(e.target[2].value !== e.target[3].value) {
                            alert("密码不一致")
                            return
                        }
                        await register(e.target[0].value, e.target[1].value, e.target[2].value);
                    }}>
                        <input className={"form-control mt-4 "} type={"email"} placeholder={"邮箱（可选）"}></input>
                        <input className={"form-control mt-4"} type={"text"} placeholder={"用户名"}
                               required={true}></input>
                        <input className={"form-control mt-4"} placeholder={"密码"} type={"password"}
                               required={true}></input>
                        <input className={"form-control mt-4"} placeholder={"确认密码"} type={"password"}
                               required={true}></input>
                        <button className={"btn btn-primary mt-4 w-100"}>注册</button>

                    </form>


                </div>

                <div className={"col-2"}></div>
            </div>

        </div>

    </>
}

export default Register;