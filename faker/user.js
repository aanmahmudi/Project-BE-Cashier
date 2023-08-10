import user from '../models/User.js'
import { faker } from '@faker-js/faker'

const run = async (limit) => {
    try {
        var data = []
        for (var i = 0; i < limit; i++) {
            data.push({
                fullname: faker.name.fullName(),
                email: faker.internet.email(),
                password: faker.internet.password(),
            })
        }

    const fakeData = await user.insertMany(data)

    if (fakeData){
        console.log(fakeData)
        console.log('Total Data: ' + fakeData.length)

        process.exit()
    } 
    } catch (err) {
        console.log(err)
        process.exit()
    }
}

export { run }