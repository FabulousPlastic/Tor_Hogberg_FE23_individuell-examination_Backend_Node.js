const cors = require("cors");
const app = require("./app");

const port = process.env.PORT || 8000;

app.use(cors());

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
