import { type Browser, type Page } from 'puppeteer';

import steamLogin from './steam';
import { newPage } from './utils';

export async function getGiveaways(page: Page): Promise<string[]> {
	return page.evaluate((): string[] => {
		const currentDate: number = Date.now();

		const giveaways: HTMLDivElement[] = [
			...document.body.querySelectorAll<HTMLDivElement>(
				'div[data-game-id] > div:not(.is-faded)',
			),
		];

		return giveaways.reduce(
			(accumulator: string[], element: HTMLDivElement): string[] => {
				const unixTimeStamp: string | null | undefined = element
					.querySelector<HTMLSpanElement>('span[data-timestamp]')
					?.getAttribute('data-timestamp');

				const unixTimeStampNum = Number(unixTimeStamp);

				if (!Number.isNaN(unixTimeStamp) && unixTimeStampNum > 0) {
					const convertedDate: number = unixTimeStampNum * 1_000;

					/**
					 * Only add giveaways that will end within an hour
					 */
					if (convertedDate - currentDate <= 3_600_000) {
						const href: string | undefined =
							element.querySelector<HTMLAnchorElement>(
								'a.giveaway__heading__name',
							)?.href;

						if (href !== undefined) {
							accumulator.push(href);
						}
					}
				}

				return accumulator;
			},
			[],
		);
	});
}

async function joinGiveawaysFromURLS(
	browser: Browser,
	urls: string[],
): Promise<void> {
	/**
	 * Join giveaways by the urls order
	 */
	for (let index = 0; index < urls.length; index += 1) {
		const url: string = urls[index];

		// eslint-disable-next-line no-await-in-loop
		const page = await newPage(browser, url);

		try {
			// eslint-disable-next-line no-await-in-loop
			await Promise.all([
				page.waitForSelector('div[data-do="entry_insert"]', { timeout: 5_000 }),
				page.click('div[data-do="entry_insert"]'),
			]);
		} catch (error: unknown) {
			console.error(error);
		} finally {
			// eslint-disable-next-line no-await-in-loop
			await page.close();
		}
	}
}

export async function joinGiveaways(
	browser: Browser,
	page: Page,
): Promise<void> {
	await Promise.all([
		page.waitForNavigation({ waitUntil: 'networkidle0' }),
		page.reload(),
	]);

	await steamLogin(page);

	const urls: string[] = await getGiveaways(page);

	await joinGiveawaysFromURLS(browser, urls);

	console.info(
		`[${new Date().toLocaleString()}]`,
		`Joining ${urls.length}\n`,
		urls.join(',\n'),
	);
}
