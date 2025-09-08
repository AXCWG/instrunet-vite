import {Card} from "@mantine/core";

// eslint-disable-next-line react/prop-types
function CardWrapper({href, title, children}){
    return <div className={"col-sm-6 "}>
        <Card onClick={()=>window.location.href=href} className={"zoom-on-hover"} withBorder={true} shadow={"sm"}>
            <div className={"display-6"}>
                {title}
            </div>
            {children}
        </Card>

    </div>
}

export default CardWrapper;