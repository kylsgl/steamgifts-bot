import http from 'node:http';

import { CronJob } from 'cron';

import { joinGiveaways } from './steamgifts';
import { newBrowser, newPage } from './utils';

async function app(): Promise<void> {
	const steamGiftsURL: string =
		process.env.STEAMGIFTS_URL ??
		'https://www.steamgifts.com/giveaways/search?type=new';

	const url = new URL(steamGiftsURL);

	const browser = await newBrowser();

	try {
		const page = await newPage(browser, url.href);

		await joinGiveaways(browser, page, url.href);

		/**
		 * 192 points every 8 hours
		 */
		CronJob.from({
			cronTime: process.env.CRON ?? '* */8 * * *',
			onTick: (): void => {
				joinGiveaways(browser, page, url.href).catch((error: unknown): void => {
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
