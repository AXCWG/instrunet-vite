import {createRoot} from 'react-dom/client';
import App from './App';
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Search from "./Search";
import Player from "./Player";
import Query from "./Query";
import Pitched from "./Pitched";
import '@mantine/core/styles.css'
import {MantineProvider} from "@mantine/core";
import LrcTest from "./LrcTest.jsx";

function PageNotFound() {
    return (
        <>
            <div className="container">
                <h1 className={"display-1"}>正在建设中或不存在该页面</h1>
            </div>
        </>
    )
}

createRoot(document.getElementById('root')).render(
    <MantineProvider>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App/>}/>
                <Route path="/search" element={<Search/>}/>
                <Route path="/player" element={<Player/>}/>
                <Route path="/query" element={<Query/>}/>
                <Route path="/404" element={<PageNotFound/>}/>
                <Route path={"*"} element={<Navigate replace to="/404"/>}/>
                <Route path={"/pitched-download"} element={<Pitched/>}/>
                <Route path={"/LrcTest"} element={<LrcTest/>}/>

            </Routes>
        </BrowserRouter>
    </MantineProvider>
)
