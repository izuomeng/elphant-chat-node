import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

sqlite3.verbose();

// const db = new sqlite3.Database('elchat.db');

// // const createTableStatement = db.prepare('CREATE TABLE $name ($columns)');

// db.run('CREATE TABLE user (id TEXT PRIMARY KEY, name TEXT, avatar TEXT, phone TEXT)');
// // createTableStatement.run({
// //   $name: 'message',
// //   $columns:
// //     'id TEXT PRIMARY KEY, text TEXT, type INTEGER, image TEXT, sender TEXT, receiverId TEXT, time INTEGER, haveRead TEXT'
// // });

// db.run(
//   'insert into user values ("user4", "克拉默", "https://img.alicdn.com/tfs/TB1Iawfl6MZ7e4jSZFOXXX7epXa-300-300.jpg", "13121210168")'
// );

// db.all('select * from user', (err, rows) => {
//   console.log(rows);
// });

class Db {
  db: Database<sqlite3.Database, sqlite3.Statement> | undefined;

  async getDb() {
    if (this.db) {
      return this.db;
    }
    this.db = await open({
      filename: 'elchat.db',
      driver: sqlite3.Database
    });
    await Promise.all([
      this.db.run(
        'CREATE TABLE if not exists user (id TEXT PRIMARY KEY, name TEXT, avatar TEXT, phone TEXT)'
      ),
      this.db.run(
        'CREATE TABLE if not exists message(id TEXT PRIMARY KEY, text TEXT, type INTEGER, image TEXT, sender TEXT, receiverId TEXT, time INTEGER, haveRead TEXT)'
      )
    ]);
    return this.db;
    // await this.db.run(
    //   'insert into user values ("user4", "克拉默", "https://img.alicdn.com/tfs/TB1Iawfl6MZ7e4jSZFOXXX7epXa-300-300.jpg", "13121210168")'
    // );
    // const rows = await this.db.all('select * from user');
    // console.log(rows);
  }
}

export const elephantDb = new Db();
