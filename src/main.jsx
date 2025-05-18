import ReactDOM from 'react-dom/client';
import App from './Instrunet/App.jsx';
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Search from "./Instrunet/Search.jsx";
import Player from "./Instrunet/Player.jsx";
import Query from "./Instrunet/Query.jsx";
import Login from "./Instrunet/Login.jsx";
import Register from "./Instrunet/Register.jsx";
import Userapi from "./Instrunet/userapi.jsx";
import {fetchUrl, WebRoutes} from "./Instrunet/Singletons.js";
import Pitched from "./Instrunet/Pitched.jsx";
import '@mantine/core/styles.css'
import {MantineProvider} from "@mantine/core";
import Home from "./Instrunet/Home.jsx";
import AccountDeletion from "./Instrunet/AccountDeletion.jsx";
import '@mantine/core/styles.css';
import PlayList from "./Instrunet/PlayList.jsx";
import LrcTest from "./Instrunet/LrcTest.jsx";
import 'react-image-crop/dist/ReactCrop.css'
import SecretPage from "./Instrunet/SecretPage.jsx";
import {Index} from "./index.jsx";

(async () => {
    const online = await (async () => {
        try {
            return (await fetch(fetchUrl + "ping")).ok
        } catch (e) {
            return false;
        }
    })()

    function PageNotFound() {
        return (
            <>
                <div className="container">
                    <h1 className={"display-1"}>正在建设中或不存在该页面</h1>
                </div>
            </>
        )
    }

    function Logout() {
        fetch(fetchUrl + "logout", {
            credentials: "include",
        })
        window.location.href = "/"
    }


// TODO: Pending homepage

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
        online === true ?
            <MantineProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path={"*"} element={<Navigate replace to="/404"/>}/>
                        <Route path={"/404"} element={<PageNotFound/>}/>
                        <Route path={"/"} element={<Index/>}/>
                        <Route path={"/instrunet"}>
                            <Route index element={<App/>}/>
                            <Route path={"search"} element={<Search/>}/>
                            <Route path={"player"} element={<Player/>}/>
                            <Route path={"query"} element={<Query/>}/>
                            <Route path={"login"} element={<Login/>}/>
                            <Route path={"register"} element={<Register/>}/>
                            <Route path={"pitched-download"} element={<Pitched/>}/>
                            <Route path={"userapi"} element={<Userapi/>}/>
                            <Route path={"logout"} element={<Logout/>}/>
                            <Route path={"home"} element={<Home/>}/>
                            <Route path={"AccDel"} element={<AccountDeletion/>}/>
                            <Route path={"playlist"} element={<PlayList createNew={true}/>}/>
                            <Route path={"playlist/:playlistuuid"} element={<PlayList createNew={false}/>}/>
                            <Route path={"LrcTest"} element={<LrcTest/>}/>
                            <Route path={"secret-page"} element={<SecretPage/>}/>
                        </Route>


                    </Routes>
                </BrowserRouter>
            </MantineProvider> : <div className={"display-1"}>维护中</div>
    )
    ;

})()


