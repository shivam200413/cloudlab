// Shared in-memory workspace store.
// Replace with Redis or SQLite for persistence across restarts.
const workspaces = new Map();
module.exports = { workspaces };
