# joggingtracker-APP

## Database && APIs

[DESCRIPTION](https://docs.google.com/document/d/1-_Ur_6xM7_Cp712ZpBJVIo30CfjlvCc26-7unL5eJIw/edit)

## API Documentation

[Here](https://mahmoudserag.docs.apiary.io/)

## Local Setup

1. Install Node.js
2. Install postgres
3. Install git

## Clone the repository

git clone <https://github.com/MahmoudSerag/jogging-tracker-app.git>

1. cd to the repository directory
`cd joggingtracker-APP`

2. Install dependencies
`npm install`

3. Create env.js file
`cd config/env.js`

4. Run server
`npm run dev`

## Environment Variables

```

exports.config = {
  serverPort: int, { example: 3000 },
  JWT_privateKey: string, { example: ' hdasjkdhksajdhska4565@#@$!' },
  JwtExpire: string, { example: '30d' },
  user: string, { example: 'serag' },
  host: string, { example: 'localhost' },
  defaultDatabase: string, { should be: 'postgres' },
  currentDatabase: string, { example: 'joggingtracker' },
  password: number, { 123456 },
  databasePort: number, { 5432 },
  cookieExpireIn: string, { '30' },
};
```
