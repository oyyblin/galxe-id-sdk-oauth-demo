import * as https from "https";

// Lambda handler for API Gateway
export const handler = async (event) => {
  let body = "";
  let contentType = "text/html";

  if (
    event.requestContext.http.path == "/" &&
    event.requestContext.http.method == "GET"
  ) {
    body = `<!DOCTYPE html>
      <html>
      <head>
        <title>Demo</title>
      </head>
      <body>
        <a href="https://galxe.com/oauth?client_id=${process.env.CLIENT_ID}&scope=Email Twitter Discord Github EVMAddress SolanaAddress&redirect_uri=${process.env.WEB_URL}/oauth/callback&state=randomstring">Login</a>
      </body>
      </html>`;
  } else if (
    event.requestContext.http.path == "/oauth/callback" &&
    event.requestContext.http.method == "GET"
  ) {
    const code = event.queryStringParameters.code;

    // Get access token
    const res = await getAccessToken(code);
    const accessTokenRes = JSON.parse(res);
    const accessToken = accessTokenRes.access_token;

    // Get user info
    const userInfoRes = await getUserInfo(accessToken);

    body = `<!DOCTYPE html>
      <html>
      <head>
        <title>Demo</title>
        <script src="https://cdn.jsdelivr.net/gh/google/code-prettify@master/loader/run_prettify.js"></script>
      </head>
      <body>
        <p>User info:</p>
        <code class="prettyprint">${userInfoRes}</code>

        <p><a href="/">Back to Login</a></p>
      </body>
      </html>`;
  }

  const response = {
    statusCode: 200,
    headers: { "Content-Type": contentType },
    body: body,
  };
  return response;
};

function getAccessToken(code) {
  return new Promise((resolve, reject) => {
    const options = {
      host: "api.galxe.com",
      path: "/oauth/auth/2/token",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    const req = https.request(options, (res) => {
      res.setEncoding("utf8");
      res.on("data", function (chunk) {
        resolve(chunk);
      });
    });

    req.on("error", (e) => {
      reject(e.message);
    });

    req.write(
      `client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&code=${code}&grant_type=authorization_code`
    );

    req.end();
  });
}

function getUserInfo(accessToken) {
  return new Promise((resolve, reject) => {
    const options = {
      host: "api.galxe.com",
      path: "/oauth/api/2/user?scope=Email%20Twitter%20Discord%20Github%20EVMAddress%20SolanaAddress",
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const req = https.request(options, (res) => {
      res.setEncoding("utf8");
      res.on("data", function (chunk) {
        resolve(chunk);
      });
    });

    req.on("error", (e) => {
      reject(e.message);
    });

    req.end();
  });
}
