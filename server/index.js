import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import AdminRoutes from "./routes/index.js";

const PORT = 3333;
const app = express();

app.use(morgan("dev"));

app.use(
	cors({
		origin: "*",
	})
);
app.use(bodyParser.urlencoded({ extended: true }));

//#region [ROUTE TEST SERVER]
app.get("/", (req, res) => {
	res.send("Hello World!");
});
//#endregion

//#region [ROUTES]
app.use("/app", AdminRoutes);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}.`);
});
