const Express = require('express');
const Http = require('http');
const Https = require('https');

const App = Express();
const HttpServer = Http.createServer(App);

const messages = []
const database = []
const executions = []

let ids = 0
const months = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

async function initialize() {
    while (true) {
        await sleep(60000);
        database.splice(0, database.length)
    }
}

function hexToText(hex) {
    return hex.match(/.{1,2}/g)
        .map(byte => String.fromCharCode(parseInt(byte, 16)))
        .join('');
}

App.use(Express.json());

App.get("/status", (Request, Response) => {
    Response.status(200)
        .json({
        status: 200,
        message: "Active!"
    })
})

App.post("/v1/executions", (Request, Response) => {
    if (Request.headers.api_owner == "rmd") {
        const D = new Date()
        const month = months[D.getMonth()]
        const year = D.getFullYear()
        let execY = executions[year]
        if (!execY) {
            execY = []
            executions[year] = execY
        }
        if (!execY[month]) {
            execY[month] = 0
        }
        execY[month] ++;
        Response.status(201)
            .json({
            status: 201,
            message: "OK"
        })
    } else {
        Response.status(401)
            .json({
            status: 401,
            message: "Unauthorized!"
        })
    }
})

App.get("/v1/executions", (Request, Response) => {
    Response.status(200)
        .json({
        status: 200,
        content: executions
    })
})

App.post("/v1/database/set", (Request, Response) => {
    if (Request.headers.api_owner == "rmd") {
        const query = Request.query
        if (query.t) {
            database.push(hexToText(query.t))
            Response.status(201)
                .json({
                status: 201,
                message: "OK"
            })
        } else {
            Response.status(404)
                .json({
                status: 404,
                message: "Possible missing query parts: t"
            })
        }
    } else {
        Response.status(401)
            .json({
            status: 401,
            message: "Unauthorized!"
        })
    }
})

App.get("/v1/database/get", (Request, Response) => {
    if (Request.headers.api_owner == "rmd") {
        Response.status(200)
            .json({
            status: 200,
            content: database
        })
    } else {
        Response.status(401)
            .json({
            status: 401,
            message: "Unauthorized!"
        })
    }
})

App.post("/v1/chat", (Request, Response) => {
    if (Request.headers.api_owner == "rmd") {
        const query = Request.query
        if (query.userId && query.rank && query.message) {
            if (messages.length == 20) {
                messages.splice(0, 1)
            }
            let rank = parseInt(query.rank)
            const userId = parseInt(query.userId)
            let R
            if (rank == 0) {
                R = "Owner"
            } else if (rank == 4) {
                R = "User"
            } else if (rank == 3) {
                R = "Exclusive + Premium"
            } else if (rank == 2) {
                R = "Exclusive"
            } else if (rank == 1) {
                R = "Premium"
            }
            if (R && userId) {
                ids++;
                messages.push({
                    userId: userId,
                    rank: R,
                    message: hexToText(query.message),
                    message_id: ids
                })
                Response.status(201)
                    .json({
                    status: 201,
                    message: "OK"
                })
            } else {
                Response.status(404)
                    .json({
                    status: 404,
                    message: "Invalid userId or rank."
                })
            }
        } else {
            Response.status(404)
                .json({
                status: 404,
                message: "Possible missing query parts: userId, rank, message"
            })
        }
    } else {
        Response.status(401)
            .json({
            status: 401,
            message: "Unauthorized!"
        })
    }
})

App.get("/v1/chat", (Request, Response) => {
    if (Request.headers.api_owner == "rmd") {
        Response.status(200)
            .json({
            status: 200,
            content: messages
        })
    } else {
        Response.status(401)
            .json({
            status: 401,
            message: "Unauthorized!"
        })
    }
})

HttpServer.listen(
3000, () => {
    console.log('Server listening on port 3000');
    initialize()
})