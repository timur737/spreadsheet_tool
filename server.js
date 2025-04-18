const express = require('express');
const bodyParser = require('body-parser');
const sheetsRouter = require('./tools');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use('/api', sheetsRouter);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});