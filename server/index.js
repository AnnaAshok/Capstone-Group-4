const express = require("express");
const { graphqlHTTP } = require("express-graphql");
// const schema = require("../schema/schema");
const connectDB = require("./config/db");
const cors = require("cors");
const app = express();
const user = require("./models/users")

app.use(cors());

// app.use(
//     "/graphql",
//     graphqlHTTP({
//         schema,
//         graphiql: true,
//     })
// );

connectDB();

app.listen(5000, () => {
    console.log('App listening on port 5000')
})