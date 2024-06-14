import http from 'node:http';

import { CronJob } from 'cron';

import { joinGiveaways } from './steamgifts';
import { newBrowser, newPage } from './utils';

async function app(): Promise<void> {
	const steamGiftsURL: string =
		process.env.STEAMGIFTS_URL ?? 'https://www.steamgifts.com/';

	const url = new URL(steamGiftsURL);

	const browser = await newBrowser();

	try {
		const page = await newPage(browser, url.href);

		await joinGiveaways(browser, page);

		/**
		 * Run every 4 hours
		 */
		CronJob.from({
			cronTime: process.env.CRON ?? '* */4 * * *',
			onTick: (): void => {
				joinGiveaways(browser, page).catch((error: unknown): void => {
					console.error(error);
				});
			},
			start: true,
		});
	} catch (error: unknown) {
		await browser.close();

		console.error(error);
	}
}

/**
 * Run as a web server
 */
http
	.createServer((_, response): void => {
		response.writeHead(200).end('Hello World');
	})
	.listen(8_080, '::', (): void => {
		app().catch((error: unknown): void => {
			console.error(error);
		});
	});
