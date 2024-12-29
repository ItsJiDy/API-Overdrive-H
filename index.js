const Express = require('express');
const Http = require('http');
const Https = require('https');

const App = Express();
const HttpServer = Http.createServer(App);

const firebase = process.env.FIREBASEURL
const get_api_key = process.env.APIKEYURL

function dec(str) {
    var chunked = [];
    for (var i = 0; i < str.length; i = i + 2) {
        chunked[i] = String.fromCharCode(parseInt(str[i] + str[i + 1], 36));
    }
    return chunked.join("");
}

App.get("/status", (Request, Response) => {
    Response.status(200)
        .json({
        status: 200,
        message: "Active!"
    })
})

App.post('/v1/checkpremium/:userid', (Request, Response) => {
    const api_key = Request.headers.api_key;
    if (api_key) {
        const key = dec(dec(api_key));
        if (key) {
            Https.get(get_api_key + key, (Res) => {
                let res = ''
                Res.on('data', (Chunk) => {
                    res += Chunk
                })
                Res.on('end', () => {
                    res = JSON.parse(res)
                    if (!res.errors) {
                        Https.get('https://inventory.roblox.com/v1/users/' + Request.params.userid + '/items/GamePass/22739804', (Res) => {
                            let Data = ''
                            Res.on('data', (Chunk) => {
                                Data += Chunk
                            })
                            Res.on('end', () => {
                                Data = JSON.parse(Data)
                                if (Data.data && Data.data.length > 0) {
                                    Response.status(200)
                                        .json({
                                        status: 200,
                                        isowned: true
                                    })
                                } else {
                                    if (Data.errors) {
                                        Response.status(404)
                                            .json({
                                            status: 404,
                                            message: "invalid user id."
                                        })
                                    } else {
                                        Response.status(200)
                                            .json({
                                            status: 200,
                                            isowned: false
                                        })
                                    }
                                }
                            })
                        })
                    } else {
                        Response.status(403)
                            .json({
                            status: 403,
                            message: "missing or invalid api key."
                        })
                    }
                })
            })
        } else {
            Response.status(403)
                .json({
                status: 403,
                message: "missing or invalid api key."
            })
        }
    } else {
        Response.status(403)
            .json({
            status: 403,
            message: "missing or invalid api key."
        })
    }
})

App.post('/v1/checkexclusive/:userid', (Request, Response) => {
    const api_key = Request.headers.api_key;
    if (api_key) {
        const key = dec(dec(api_key));
        if (key) {
            Https.get(get_api_key + key, (Res) => {
                let res = ''
                Res.on('data', (Chunk) => {
                    res += Chunk
                })
                Res.on('end', () => {
                    res = JSON.parse(res)
                    if (!res.errors) {
                        Https.get('https://inventory.roblox.com/v1/users/' + Request.params.userid + '/items/GamePass/926084952', (Res) => {
                            let Data = ''
                            Res.on('data', (Chunk) => {
                                Data += Chunk
                            })
                            Res.on('end', () => {
                                Data = JSON.parse(Data)
                                if (Data.data && Data.data.length > 0) {
                                    Response.status(200)
                                        .json({
                                        status: 200,
                                        isowned: true
                                    })
                                } else {
                                    if (Data.errors) {
                                        Response.status(404)
                                            .json({
                                            status: 404,
                                            message: "invalid user id."
                                        })
                                    } else {
                                        Response.status(200)
                                            .json({
                                            status: 200,
                                            isowned: false
                                        })
                                    }
                                }
                            })
                        })
                    } else {
                        Response.status(403)
                            .json({
                            status: 403,
                            message: "missing or invalid api key."
                        })
                    }
                })
            })
        } else {
            Response.status(403)
                .json({
                status: 403,
                message: "missing or invalid api key."
            })
        }
    } else {
        Response.status(403)
            .json({
            status: 403,
            message: "missing or invalid api key."
        })
    }
})

App.post('/v1/isuserbanned/:userid', (Request, Response) => {
    const api_key = Request.headers.api_key;
    if (api_key) {
        const key = dec(dec(api_key));
        if (key) {
            Https.get(get_api_key + key, (Res) => {
                let res = ''
                Res.on('data', (Chunk) => {
                    res += Chunk
                })
                Res.on('end', () => {
                    res = JSON.parse(res)
                    if (!res.errors) {
                        Https.get("https://" + firebase + "/bans.json", (Res) => {
                            let res = ''
                            Res.on('data', (Chunk) => {
                                res += Chunk
                            })
                            Res.on('end', () => {
                                let newjson = JSON.parse(res)
                                if (newjson[Request.params.userid]) {
                                    Response.status(200)
                                        .json({
                                        status: 200,
                                        isbanned: true
                                    })
                                } else {
                                    Response.status(200)
                                        .json({
                                        status: 200,
                                        isbanned: false
                                    })
                                }
                            })
                        })
                    } else {
                        Response.status(403)
                            .json({
                            status: 403,
                            message: "missing or invalid api key."
                        })
                    }
                })
            })
        } else {
            Response.status(403)
                .json({
                status: 403,
                message: "missing or invalid api key."
            })
        }
    } else {
        Response.status(403)
            .json({
            status: 403,
            message: "missing or invalid api key."
        })
    }
})

HttpServer.listen(
3000, () => {
    console.log('Server listening on port 3000');
})