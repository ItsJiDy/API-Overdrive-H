const Express = require('express');
const Http = require('http');
const Https = require('https');

const App = Express();
const HttpServer = Http.createServer(App);

const firebase = process.env.FIREBASEURL
const get_api_key = process.env.APIKEYURL

const rate_limit = [];
let executions = 0

function dec(str) {
    var chunked = [];
    for (var i = 0; i < str.length; i = i + 2) {
        chunked[i] = String.fromCharCode(parseInt(str[i] + str[i + 1], 36));
    }
    return chunked.join("");
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function init_rate_limit(api_key) {
    rate_limit[api_key] = 5;
    while (rate_limit[api_key] > 0) {
        await sleep(1000);
        rate_limit[api_key]--;
    };
    delete rate_limit[api_key];
}

App.use(Express.json());

App.get("/status", (Request, Response) => {
    Response.status(200)
        .json({
        status: 200,
        message: "Active!"
    })
})

App.post('/v1/executions', (Request, Response) => {
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
                        Response.status(200)
                            .json({
                            status: 200,
                            total_executions: executions
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

App.post('/v1/login', (Request, Response) => {
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
                        if (rate_limit[api_key]) {
                            Response.status(403)
                                .json({
                                status: 403,
                                message: "you are being rate limited, try again later!",
                                seconds: rate_limit[api_key] || 0
                            })
                        } else {
                            executions++;
                            Response.status(200)
                                .json({
                                status: 200,
                                message: "thank you for using Overdrive H!"
                            })
                            init_rate_limit(api_key);
                        }
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

App.post('/v1/ispremium', (Request, Response) => {
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
                        Https.get('https://inventory.roblox.com/v1/users/' + res.id + '/items/GamePass/22739804', (Res) => {
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
                                        valid: true
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
                                            valid: false
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

App.post('/v1/isexclusive', (Request, Response) => {
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
                        Https.get('https://inventory.roblox.com/v1/users/' + res.id + '/items/GamePass/926084952', (Res) => {
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
                                        valid: true
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
                                            valid: false
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

App.post('/v1/isuserbanned', (Request, Response) => {
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
                        const userId = res.id
                        Https.get("https://" + firebase + "/bans.json", (Res) => {
                            let res = ''
                            Res.on('data', (Chunk) => {
                                res += Chunk
                            })
                            Res.on('end', () => {
                                let newjson = JSON.parse(res)
                                if (newjson[userId]) {
                                    Response.status(200)
                                        .json({
                                        status: 200,
                                        isbanned: true,
                                        reason: newjson[userId] || "Unspecified!"
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

App.post('/v1/user/get', (Request, Response) => {
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
                        Response.status(200)
                            .json({
                            status: 200,
                            userId: res.id,
                            userName: res.name
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