const path = require('path')
const Mali = require('mali')
const uuid = require('uuid/v4')

const PROTO_PATH = path.resolve(__dirname, './protos/ideas.proto')
const HOST_PORT = 'localhost:50051'

let ideas = [
  { id: '3f08f384-e17a-40df-959e-34d8fd3478b8', body: 'Uber but for basketball' },
  { id: 'a8a6440d-bb06-4be6-a2b3-3bdc3e4d9168', body: 'Uber but for helpers' },
]

function list (ctx) {
  ctx.res = { ideas }
}

function get (ctx) {
  const idea = ideas.find((i) => i.id === ctx.req.id)
  ctx.res = idea
}

function insert (ctx) {
  const idea = { ...ctx.req, id: uuid() }
  ideas = [...ideas, idea]
  ctx.res = idea
}

function update (ctx) {
  ideas = ideas.map((idea) => {
    if (idea.id !== ctx.req.id) {
      return idea;
    }

    return { ...idea, ...ctx.req }
  })
  ctx.res = ctx.req
}

function remove (ctx) {
  ideas = ideas.filter((idea) => idea.id !== ctx.req.id)
  ctx.res = {}
}


function main () {
  const app = new Mali(PROTO_PATH, 'IdeaService')
  app.use({ list, get, insert, update, remove })
  console.log(`GRPC server is listening on ${HOST_PORT}`)
  app.start(HOST_PORT)
}

main()
