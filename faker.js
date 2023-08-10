import { connection } from "./connection.js"

connection ()

const args = process.argv


const limit = args[3] || 10
const fakerfile = args[2]
const faker = await import(`./faker/${fakerfile}`)
faker.run(limit);