/* Custom production server for Next.js on cPanel / CloudLinux Node.js Selector.
   Passenger supplies a Unix socket through PORT; a numeric PORT also works. */
const { createServer } = require("node:http");
const { loadEnvConfig } = require("@next/env");

// A custom server must load Next's env files itself so runtime secrets such as
// ADMIN_PASSWORD and AUTH_SECRET are available to server actions.
loadEnvConfig(process.cwd());

const next = require("next");

const port = process.env.PORT || 3000;
const isSocket = typeof port === "string" && port.startsWith("/");
const app = next({ dev: false });

app.prepare().then(() => {
  const server = createServer((req, res) => app.getRequestHandler()(req, res));
  const done = () => console.log(`> JJ Ebube ready on ${isSocket ? "passenger socket" : `0.0.0.0:${port}`}`);
  if (isSocket) server.listen(port, done);
  else server.listen(Number(port), "0.0.0.0", done);
});
