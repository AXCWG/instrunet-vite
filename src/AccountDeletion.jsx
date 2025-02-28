import {fetchUrl} from "./Singletons";

function AccountDeletion() {
    return (<>
        <div style={{maxWidth: "24rem"}}
             className={"container  vh-100 d-flex justify-content-center align-items-center flex-column gap-3"}>
            <div className={"display-2"}>警告</div>
            <div style={{textAlign: "center"}}>所有与帐号关联的数据都将被删除，确定吗？</div>
            <div className={"w-100 d-md-block d-flex"}>
                <button onClick={async () => {
                    await fetch(fetchUrl + "delacc", {
                        credentials: "include",
                    })

                    window.location.href = "/"

                }} className={"btn btn-danger w-100"}>确定
                </button>
                <button onClick={() => {
                    window.location.href = "/home"
                }} className={"btn btn-light w-100"}>取消
                </button>
            </div>

        </div>
    </>)
}

export default AccountDeletion;