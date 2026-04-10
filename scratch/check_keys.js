
const keys = Object.keys(process.env).filter(k => k.includes("GCP") || k.includes("GOOGLE") || k.includes("USAGE"));
console.log("Found Keys:", keys);
