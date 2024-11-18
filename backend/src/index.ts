import express from 'express'
import { createServer } from 'http'
import AppModule from './modules/app/app.module'

const app = new AppModule().app
const server = createServer(app)

server.listen(8080, () => {
  console.log('Server is running on http://localhost:3000')
}) 