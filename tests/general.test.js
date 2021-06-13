const request = require('supertest')
const mongoose = require('mongoose')

let app = require('../app').app

beforeEach(() => {
    jest.setTimeout(20000)
})

describe('(SERVER) Request Main Pages', () => {
    it('Should receive 200 OK HTTP response for GET /', async (done) => {
        const res = await request(app).get('/')
        expect(res.statusCode).toEqual(200)
        done()
    })

    it('Should receive 200 OK HTTP response for GET /index', async (done) => {
        const res = await request(app).get('/index')
        expect(res.statusCode).toEqual(200)
        done()
    })

    it('Should receive 200 OK HTTP response for GET /catalogue', async (done) => {
        const res = await request(app).get('/catalogue')
        expect(res.statusCode).toEqual(200)
        done()
    })
    
    it('Should receive 200 OK HTTP response for GET /about', async (done) => {
        const res = await request(app).get('/about')
        expect(res.statusCode).toEqual(200)
        done()
    })

    it('Should receive 200 OK HTTP response for GET /tos', async (done) => {
        const res = await request(app).get('/tos')
        expect(res.statusCode).toEqual(200)
        done()
    })

    it('Should receive 200 OK HTTP response for GET /privacy', async (done) => {
        const res = await request(app).get('/privacy')
        expect(res.statusCode).toEqual(200)
        done()
    })
})