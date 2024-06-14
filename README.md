# SteamGifts Bot

<img src="https://img.shields.io/github/package-json/v/kylsgl/steamgifts-bot" /> <img src="https://img.shields.io/github/license/kylsgl/steamgifts-bot" />

A simple SteamGifts bot that will automatically join giveaways ending within the next hour. It runs periodically every four hours. Requires **SteamGuard**.

## Usage

Create a .env file

```env
STEAM_ID=AzureDiamond
STEAM_PW=hunter2
```

Install dependencies

```
pnpm install
```

Build the app

```
pnpm build
```

Start the app

```
pnpm start
```

## Environment Variables

| Parameter        | Type     | Default                       | Description    |
| :--------------- | :------- | :---------------------------- | :------------- |
| `CRON`           | `string` | `* */4 * * *`                 | Join interval  |
| `STEAMGIFTS_URL` | `string` | `https://www.steamgifts.com/` | SteamGifts URL |
| `STEAM_ID`       | `string` |                               | Steam Username |
| `STEAM_PW`       | `string` |                               | Steam Password |

## License

[MIT](https://github.com/kylsgl/steamgifts-bot/blob/main/LICENSE)
