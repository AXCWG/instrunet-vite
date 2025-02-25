import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Search from "./Search.jsx";
import Player from "./Player";
import Query from "./Query";
import Login from "./Login";
import Register from "./Register";
import Userapi from "./userapi";
import {fetchUrl} from "./Singletons";
import Pitched from "./Pitched";
import Home from "./Home";
import AccountDeletion from "./AccountDeletion";
import '@mantine/core/styles.css';
import {MantineProvider} from '@mantine/core';
import PlayList from "./PlayList.jsx";


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
    <MantineProvider>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App/>}/>
                <Route path="/search" element={<Search/>}/>
                <Route path="/player" element={<Player/>}/>
                <Route path="/query" element={<Query/>}/>
                <Route path="/404" element={<PageNotFound/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path={"/register"} element={<Register/>}/>
                <Route path={"*"} element={<Navigate replace to="/404"/>}/>
                <Route path={"/pitched-download"} element={<Pitched/>}/>
                <Route path={"/userapi"} element={<Userapi/>}/>
                <Route path={"/logout"} element={<Logout/>}/>
                <Route path={"/home"} element={<Home/>}/>
                <Route path={"/AccDel"} element={<AccountDeletion/>}/>
                <Route path={"/playlist"} element={<PlayList createNew={true}/>}/>
                <Route path={"/playlist/:playlistuuid"} element={<PlayList createNew={false }/>}/>

            </Routes>
        </BrowserRouter>
    </MantineProvider>
);


