import {Navbar} from "./App.jsx";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {fetchUrl} from "./Singletons.js";
import {Container, Grid, Image} from "@mantine/core";
import sampleImg from "./Assets/SampleImg.png";


function PlayList({createNew}) {
    const params = useParams();
    const [login, setLogin] = useState({
        loggedIn: false,
        uuid: "",
        username: "",
        email: "",
    });
    const [playlistParams, setPlaylistParams] = useState({
        playlistuuid: "",
        content: "",
        private: "",
        tmb: null,
        title: ""
    })
    useEffect(() => {
        async function f() {
            let res = await fetch(fetchUrl + "userapi", {
                credentials: "include",
            })
            if (res.ok) {
                let json = await res.json();
                setLogin({
                    loggedIn: true,
                    uuid: json.uuid,
                    username: json.username,
                    email: json.email,
                })
            }
            if (createNew) {

                setPlaylistParams({
                    ...playlistParams,
                    playlistuuid: crypto.randomUUID(),
                })
            } else {
                setPlaylistParams({
                    ...playlistParams,
                    playlistuuid: params.playlistuuid,
                })
            }

            console.log(createNew);
        }

        f();


    }, [])
    useEffect(
        () => {
            if (!login.loggedIn) {
                window.location.href = "/login"
            }
        }
    )

    console.log(playlistParams);
    console.log(login)

    return (
        <>
            <Navbar isFixed={true}/>
            <Container style={{marginTop: "5rem"}}>
                <Grid>

                    <Grid.Col span={4}>

                        <Image src={playlistParams.tmb ? playlistParams.tmb : sampleImg}/>
                    </Grid.Col>
                    <Grid.Col span={8}>
                        2
                    </Grid.Col>
                </Grid>
            </Container>

        </>

    )
}

export default PlayList;