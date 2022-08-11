import express, { Router, Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router: Router = express.Router();

/**
 * POST /auth/github
 * @summary Auth
 * @tags Auth
 * @return {object} 200 - success response - application/json
 */
router.get("/redirect", async (request: Request, response: Response) => {
  try {
    console.log(1);
    const requestToken = request.query.code;
    console.log("authorization code:", requestToken);
    const tokenResponse = await axios({
      method: "POST",
      url:
        "https://github.com/login/oauth/access_token?" +
        `client_id=${process.env.GITHUB_CLIENT_ID}&` +
        `client_secret=${process.env.GITHUB_CLIENT_SECRET}&` +
        `code=${requestToken}`,
      headers: {
        accept: "application/json",
      },
    });

    const accessToken = tokenResponse.data.access_token;
    console.log(`access token: ${accessToken}`);

    const result = await axios({
      method: "GET",
      url: `https://api.github.com/user`,
      headers: {
        accept: "application/json",
        Authorization: `token ${accessToken}`,
      },
    });
    console.log(result.data);
    response.redirect(`http://localhost:5173?token=${accessToken}`);
  } catch (err) {
    console.log(err);
    response.status(404).json("Server Error");
  }
});

export default router;