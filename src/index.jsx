import {useEffect} from "react";
import {WebRoutes} from "./Singletons.js";
import {NavLink} from "react-router-dom";
import {Card} from "@mantine/core";

function Index(){

    return <>
        <div className="container">
            <div id={"header"} className="mt-5 mb-5">
                <div className={"display-1"}>
                    AXCWG


                </div>
            </div>

            <div className={"row g-4"}>
                <div className={"col-sm-6 "}>
                    <Card onClick={()=>window.location.href = WebRoutes.instruNet + "/"} className={"zoom-on-hover"} withBorder={true} shadow={"sm"}>
                        <div className={"display-6"}>
                            伴奏网
                        </div>

                        AI支持的，免费无登录的伴奏分享网站
                    </Card>
                </div>
                <div className={"col-sm-6 "}>
                    <Card onClick={()=>window.location.href = WebRoutes.speechToText + "/"} className={"zoom-on-hover"} withBorder={true} shadow={"sm"}>
                        <div className={"display-6"}>
                            语音转文字工具
                        </div>
                        “不大可用”于歌词类“带有旋律”的语音音频。
                    </Card>
                </div>

                <NavLink to={WebRoutes.instruNet + "/"}></NavLink>
                <br/>
                <br/>

            </div>
        </div>

    </>
}

export {Index};