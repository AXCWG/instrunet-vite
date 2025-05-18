import {useEffect} from "react";
import {WebRoutes} from "./Instrunet/Singletons.js";

function Index(){
    useEffect(()=>{
        window.location.href = WebRoutes.instruNet
    })
    return <>
        <div className={"display-1"}>
            AXCWG
        </div>
    </>
}

export {Index};