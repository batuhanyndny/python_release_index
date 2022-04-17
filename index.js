const express = require("express");
const axios = require('axios');
const cacheService = require("express-api-cache");
const FTP_URL = "https://www.python.org/ftp/python/";
const REGEX = /(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?/gm

// Initialize Express
const app = express();

// Create GET request
app.get("/", cacheService.cache("1 day"), async (req, res) => {
	const response = await axios.get(FTP_URL);
	const data = response.data.trim().replace(/\s+/g, '');

	const allVersions = [...new Set(Array.from(data.matchAll(REGEX), m => m[0]))];

	const sortedAllVersions = allVersions.map(a => a.split('.').map(n => +n + 100000).join('.')).sort().map(a => a.split('.').map(n => +n - 100000).join('.'));
	const uniq = new Set(sortedAllVersions);
	
	res.send([...uniq]);
});

// Initialize server
app.listen(process.env.PORT || 3000, () => {
	console.log("Running on port 5001.");
});

module.exports = app;