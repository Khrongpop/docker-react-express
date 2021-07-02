var express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

var app = express();
const port = 8080;
const { Pool } = require("pg");
const connectionString = "postgres://postgres:postgres@db:5432/todo";
// var db = pgp("postgres://postgres:postgres@db:5432/todo");

const pool = new Pool({
	connectionString,
	ssl: false,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const getTodos = (request, response) => {
	pool.query("SELECT * FROM todos ORDER BY id", (error, results) => {
		if (error) {
			throw error;
		}
		response.status(200).json(results.rows);
	});
};

const addTodo = (request, response) => {
	const { name } = request.body;
	pool.query("INSERT INTO todos (name) VALUES ($1) ", [name], (error) => {
		if (error) {
			throw error;
		}
		response.status(201).json({ status: "success", message: "Todo added." });
	});
};

const updateTodo = (request, response) => {
	const { id } = request.params;
	const { name } = request.body;

	pool.query("UPDATE todos SET name = $1 WHERE id = $2", [name, id], (error) => {
		if (error) {
			throw error;
		}
		response.status(201).json({ status: "success", message: "Todo updated." });
	});
};

const deleteTodo = (request, response) => {
	const { id } = request.params;
	pool.query("DELETE FROM todos WHERE id = $1", [id], (error) => {
		if (error) {
			throw error;
		}
		response.status(201).json({ status: "success", message: "Todo deleted." });
	});
};

app.route("/todos")
	// GET endpoint
	.get(getTodos)
	.post(addTodo);

app.route("/todos/:id").patch(updateTodo).delete(deleteTodo);

// respond with "hello world" when a GET request is made to the homepage
app.get("/", function (req, res) {
	res.send("hello world");
});

app.get("/name", function (req, res) {
	const body = {
		name: "munag",
	};
	res.send(body);
});

// app.use((req, res, next) => {
// 	// const origin = req.get("origin");

// 	// TODO Add origin validation
// 	// res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
// 	res.header("Access-Control-Allow-Origin", "http://localhost");
// 	res.header("Access-Control-Allow-Credentials", true);
// 	res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
// 	res.header(
// 		"Access-Control-Allow-Headers",
// 		"Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma"
// 	);

// 	// intercept OPTIONS method
// 	if (req.method === "OPTIONS") {
// 		res.sendStatus(204);
// 	} else {
// 		next();
// 	}
// });

// app.use(cors());
// const corsOptions = {
// 	origin: /\.your.domain\.com$/, // reqexp will match all prefixes
// 	methods: "GET,HEAD,POST,PATCH,DELETE,OPTIONS",
// 	credentials: true, // required to pass
// 	allowedHeaders: "Content-Type, Authorization, X-Requested-With",
// };

// intercept pre-flight check for all routes
// app.options("*", cors(corsOptions));

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
