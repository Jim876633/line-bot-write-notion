const express = require("express");
const line = require("@line/bot-sdk");
const { Client } = require("@notionhq/client");
const { getCreateNotionPageObj } = require("../utils");
const crypto = require("crypto");
const serverless = require("serverless-http");
require("dotenv").config();

const app = express();

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const client = new line.messagingApi.MessagingApiClient({
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
});

const pageName = process.env.PAGE_NAME;

/* -------------------------------------------------------------------------- */
/*                                    API                                     */
/* -------------------------------------------------------------------------- */

app.get("/", async (req, res) => {
  res.send("Line Bot Connect Notion Server is running");
});

app.post("/webhook", line.middleware(config), (req, res) => {
  // Make sure the request is from LINE
  try {
    const signature = crypto
      .createHmac("SHA256", config.channelSecret)
      .update(JSON.stringify(req.body))
      .digest("base64");

    if (signature === req.headers["x-line-signature"]) {
      Promise.all(req.body.events.map(handleEvent)).then((result) =>
        res.json(result)
      );
    } else {
      console.log("Invalid signature");
      res.status(400).send("Invalid signature");
    }
  } catch (err) {
    console.log(err);
  }
});

console.log("Server running at http://localhost:8888/");

exports.handler = serverless(app);

/* -------------------------------------------------------------------------- */
/*                                  Function                                  */
/* -------------------------------------------------------------------------- */

async function handleEvent(event) {
  console.log(event);
  if (event.message?.type === "text") {
    const text = event.message.text;

    let selectName = "Blog";
    if (text.includes("youtube")) {
      selectName = "Video";
    }

    await createNotionPage({ title: text, selectName });
    return Promise.resolve(null);
  } else {
    return Promise.resolve(null);
  }
}

async function createNotionPage({ title, selectName }) {
  try {
    if (!title || !selectName) {
      console.log("title or selectName is empty");
      return false;
    }

    const searchRes = await notion.search({
      query: pageName,
    });

    const databaseId = searchRes.results[0].id;

    // Check if the page already exists
    const queryRes = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: "title",
        title: {
          equals: title,
        },
      },
    });

    if (queryRes.results.length > 0) {
      console.log("Link already exists");
      return true;
    }

    const data = await notion.databases.retrieve({ database_id: databaseId });
    const propertiesValues = Object.values(data.properties);

    const titleId = propertiesValues.find(
      (property) => property.type === "title"
    ).id;
    const selectId = propertiesValues.find(
      (property) => property.type === "select"
    ).id;

    const createPageReq = getCreateNotionPageObj({
      databaseId,
      titleId,
      title,
      selectId,
      selectName,
    });

    const createRes = await notion.pages.create(createPageReq);
    if (createRes) {
      console.log("Add Notion Page Success");
      return true;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
}
