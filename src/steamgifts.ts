import { type Browser, type Page } from 'puppeteer';

import steamLogin from './steam';
import { newPage } from './utils';

export async function getGiveaways(page: Page): Promise<string[]> {
	return page.evaluate((): string[] => {
		const usePoints = Number(
			document.body.querySelector('span.nav__points')?.textContent,
		);

		if (Number.isNaN(usePoints) || usePoints <= 0) {
			return [];
		}

		let currentPoints: number = usePoints;

		const giveaways: HTMLDivElement[] = [
			...document.body.querySelectorAll<HTMLDivElement>(
				'div[data-game-id] > div:not(.is-faded)',
			),
		];

		return giveaways.reduce(
			(accumulator: string[], element: HTMLDivElement): string[] => {
				/**
				 * Giveaway entries may contain multiple 'span.giveaway__heading__thin' elements
				 * Element 'span.giveaway__heading__thin' with cost text is always last in the array
				 */
				const costText: string | undefined = [
					...element.querySelectorAll<HTMLSpanElement>(
						'span.giveaway__heading__thin',
					),
				]
					.at(-1)
					?.textContent?.replaceAll(/\D/g, '');

				const cost = Number(costText);

				if (!Number.isNaN(cost) && currentPoints >= cost) {
					currentPoints -= cost;

					const href: string | undefined =
						element.querySelector<HTMLAnchorElement>(
							'a.giveaway__heading__name',
						)?.href;

					if (href !== undefined) {
						accumulator.push(href);
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
		} catch {
			console.error('Failed to join:', url);
		} finally {
			// eslint-disable-next-line no-await-in-loop
			await page.close();
		}
	}
}

export async function joinGiveaways(
	browser: Browser,
	page: Page,
	url: string,
): Promise<void> {
	await Promise.all([
		page.waitForNavigation({ waitUntil: 'networkidle0' }),
		page.goto(url),
	]);

	await steamLogin(page);

	const urls: string[] = await getGiveaways(page);

	console.info(
		`[${new Date().toLocaleString()}]`,
		`Joining ${urls.length}\n${urls.join(',\n')}`,
	);

	await joinGiveawaysFromURLS(browser, urls);
}
