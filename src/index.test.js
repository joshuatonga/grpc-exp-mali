import path from 'path'
import test from 'ava'
import caller from 'grpc-caller'

const PROTO_PATH = path.resolve(__dirname, './protos/ideas.proto')
const client = caller('localhost:50051', PROTO_PATH, 'IdeaService')

let ideas = []

test.beforeEach(() => {
  ideas = [
    { id: '3f08f384-e17a-40df-959e-34d8fd3478b8', body: 'Uber but for basketball' },
    { id: 'a8a6440d-bb06-4be6-a2b3-3bdc3e4d9168', body: 'Uber but for helpers' },
  ]
})

test('should list all the ideas', async (t) => {
  const res = await client.list({})
  t.truthy(res.ideas.length)
})

test('should be able to get one idea', async (t) => {
  const idea = ideas[0]
  const res = await client.get({ id: idea.id })
  t.deepEqual(res, idea)
})

test('should be able to insert an idea', async (t) => {
  const idea = { body: 'Uber for singers' }
  const res = await client.insert(idea)
  t.is(res.body, idea.body)
  t.truthy(res.id)
})

test('should be able to update an idea', async (t) => {
  const idea = { ...ideas[0], body: 'Uber for dancers' }
  const res = await client.update(idea)
  t.deepEqual(res, idea)
})

test('should be able to remove an idea', async (t) => {
  const idea = ideas[0]
  const res = await client.remove({ id: idea.id })
  t.deepEqual(res, {})
})
