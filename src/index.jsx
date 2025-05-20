import {useEffect} from "react";
import {WebRoutes} from "./Singletons.js";
import {NavLink} from "react-router-dom";

function Index(){

    return <>
        <div className="container">
            <div className={"display-1"}>
                AXCWG 出品
                <div className={"display-6"}>
                    <br/>

                    <NavLink to={WebRoutes.instruNet + "/"}>伴奏网</NavLink>
                    <br/>
                    <br/>
                    <NavLink to={WebRoutes.speechToText + "/"}><strong>!免费!</strong>【AI加持】 语音转文字 （可导出txt，srt，json等文件格式）</NavLink>
                </div>


            </div>
        </div>

    </>
}

export {Index};