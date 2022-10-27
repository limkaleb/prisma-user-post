/* eslint-disable no-restricted-syntax */
// const { Sequelize, Model, DataTypes } = require('sequelize')
const _ = require('lodash')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// const db = new Sequelize({
//   dialect: 'postgres',
//   host: 'localhost',
//   username: 'postgres',
//   database: 'postgres',
//   logging: false,
// })

// class User extends Model {}

// User.init({
//   id: {
//     type: DataTypes.BIGINT,
//     autoIncrement: true,
//     primaryKey: true,
//   },
//   name: {
//     type: DataTypes.TEXT,
//   },
// }, {
//   tableName: 'users',
//   sequelize: db,
//   timestamps: true,
//   underscored: true,
// })

// class Post extends Model {}

// Post.init({
//   id: {
//     type: DataTypes.BIGINT,
//     autoIncrement: true,
//     primaryKey: true,
//   },
//   user_id: {
//     type: DataTypes.BIGINT,
//     references: {
//       model: User,
//       key: 'id',
//     },
//   },
//   name: {
//     type: DataTypes.TEXT,
//   },
// }, {
//   tableName: 'posts',
//   sequelize: db,
//   timestamps: true,
//   underscored: true,
//   indexes: [
//     { name: 'posts_user_id_idx', fields: ['user_id'] },
//   ],
// })

const config = {
  a: 10000,
  b: 4000000,
  c: 50000,
  d: 100000,
  e: 2500000,
}

const main = async () => {
  // await db.sync({ force: true })
  const data = Object.keys(config).map((c) => {
    return {
      name: c,
    }
  })
  console.log('dattaaa: ', data)
  await prisma.user.createMany({ data })

  const users = await prisma.user.findMany({})
  // console.log('users: ', typeof users[0].id)

  // await prisma.user.createMany({
  //   data: [
  //     { name: 'kasl' },
  //     { name: '312' },
  //   ],
  // })

  for (const user of users) {
    console.log('Creating Post for user', user.name)
    console.time(`Time: ${user.name}`)
    const posts = []
    for (let i = 0; i < config[user.name]; i++) {
      posts.push({ user_id: user.id.toString(), name: `${i}` })
    }
    // eslint-disable-next-line no-restricted-syntax
    for (const chunk of _.chunk(posts, 10)) {
      // eslint-disable-next-line no-await-in-loop
      await prisma.post.createMany({ data: chunk })
    }
    console.timeEnd(`Time: ${user.name}`)
  }

  // await db.close()
}

main()
