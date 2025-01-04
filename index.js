const Express = require('express');
const Http = require('http');
const Https = require('https');

const App = Express();
const HttpServer = Http.createServer(App);

const messages = []
let ids = 0

App.use(Express.json());

App.get("/status", (Request, Response) => {
    Response.status(200)
        .json({
        status: 200,
        message: "Active!"
    })
})

App.post("/v1/chat", (Request, Response) => {
    if (Request.headers.api_owner == "rmd") {
        const body = Request.body
        if (body.userId && body.rank && body.message) {
            if (messages.length == 20) {
                messages.splice(0, 1)
            }
            ids++;
            messages[messages.length + 1] = {
                userId: body.userId,
                rank: body.rank,
                message: body.message,
                message_id: ids
            }
            Response.status(201)
                .json({
                status: 201,
                message: "OK"
            })
        } else {
            Response.status(404)
                .json({
                status: 404,
                message: "Possible missing body parts: Username, Rank, Message"
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
            content: JSON.stringify(messages)
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
})