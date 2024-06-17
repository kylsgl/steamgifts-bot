import puppeteer, {
	type Browser,
	type HTTPRequest,
	type Page,
} from 'puppeteer';

import { BLOCKED_TYPES, PUPPETEER_ARGS, USER_AGENT } from './constants';

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

	await page.setUserAgent(USER_AGENT.random().toString());

	await page.setRequestInterception(true);

	page.on('request', handleBlockedTypes);

	await page.goto(url);

	return page;
}

export async function newBrowser(): Promise<Browser> {
	return puppeteer.launch(PUPPETEER_ARGS);
}
