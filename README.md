# Line bot with notion API

This is a line bot webhook to pass the link to notion database.

The reason I created this is that every time I use social media and come across interesting articles or videos, I share the link in a group chat that only I am part of. However, I can't keep track of the links to remember what I have read or watched. So, I developed this Line bot to automatically record the links in a Notion database.

Line:

<img src="/img/line-message.jpg" width="400">

Notion:

![notion-result](/img/notion-result.jpg)

## Getting Started

Follow these steps to set up and run the project:

1. Installation

```bash
git clone gh repo clone Jim876633/line-bot-write-notion
cd line-bot-write-notion
npm install
```

2. Configuration

Create a .env file in the root directory of the project. Add the following environment variables to the file:

```bash
CHANNEL_ACCESS_TOKEN="LINE_CHANNEL_ACCESS_TOKEN"
CHANNEL_SECRET="LINE_CHANNEL_SECRET"
NOTION_TOKEN="NOTION_SECRET_TOKEN"
PAGE_NAME="THE_PAGE_NAME_YOU_WANT_TO_WRITE_TO"
```

3. Run the project

```bash
npm run start
```

The project will be available at `http://localhost:8888`.

## Usage

1. Add the line bot as a friend.
2. Use the proxy service to expose the local server to the internet. (e.g. [ngrok](https://ngrok.com/))
3. Set the webhook URL to the URL of the project. (e.g. `http://xxx/webhook`)
4. Send a message to the bot.
5. The message will be written to the notion database.

## Contributing

Feel free to contribute to this project. Fork and make a Pull Request, or create an Issue if you see any problem.
