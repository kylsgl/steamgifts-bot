import puppeteer, {
	type Browser,
	type HTTPRequest,
	type Page,
} from 'puppeteer';

import { BLOCKED_TYPES, PUPPETEER_ARGS } from './constants';

function handleBlockedTypes(request: HTTPRequest): void {
	if (BLOCKED_TYPES.has(request.resourceType())) {
		request.abort().catch((error: unknown): void => {
			console.error(error);
		});

		return;
	}

	request.continue().catch((error: unknown): void => {
		console.error(error);
	});
}

export async function newPage(browser: Browser, url: string): Promise<Page> {
	const page = await browser.newPage();

	await page.setRequestInterception(true);

	page.on('request', handleBlockedTypes);

	await page.setUserAgent(
		'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
	);

	// await page.setViewport(DEFAULT_VIEWPORT);

	await page.goto(url);

	return page;
}

export async function newBrowser(): Promise<Browser> {
	return puppeteer.launch(PUPPETEER_ARGS);
}
