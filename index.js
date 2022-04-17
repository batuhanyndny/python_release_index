const axios = require('axios');
const FTP_URL = "https://www.python.org/ftp/python/";
const REGEX = /(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?/gm


export default async function handler(request, response) {
	const res = await axios.get(FTP_URL);

	const data = res.data.trim().replace(/\s+/g, '');

	const allVersions = [...new Set(Array.from(data.matchAll(REGEX), m => m[0]))];
	const sortedAllVersions = allVersions.map(a => a.split('.').map(n => +n + 100000).join('.')).sort().map(a => a.split('.').map(n => +n - 100000).join('.'));

	const uniq = new Set(sortedAllVersions);

	response.status(200).json({
		versions: uniq
	});
}
