import { type Page } from 'puppeteer';

export default async function steamLogin(page: Page): Promise<void> {
	const steamId: string | undefined = process.env.STEAM_ID;

	const steamPw: string | undefined = process.env.STEAM_PW;

	if (steamId === undefined || steamPw === undefined) {
		throw new Error('Invalid Steam credentials');
	}

	const steamLoginSelector = 'header a[href^="/?login"]';

	/**
	 * Exit if login button is not found
	 */
	try {
		await page.waitForSelector(steamLoginSelector, { timeout: 5_000 });
	} catch {
		return;
	}

	/**
	 * Click "Sign in through Steam" link
	 */
	await Promise.all([
		page.waitForNavigation({ waitUntil: 'networkidle0' }),
		page.click(steamLoginSelector),
	]);

	/**
	 * Fill and submit sign in form
	 */
	await page.type('form input[type=text]', steamId);

	await page.type('form input[type=password]', steamPw);

	await Promise.all([
		page.waitForNavigation({
			timeout: 600_000, // Wait 10 minutes for SteamGuard approval
			waitUntil: 'networkidle0',
		}),
		page.click('form button[type=submit]'),
	]);

	/**
	 * Approve Steamgifts sign in
	 */
	await Promise.all([
		page.waitForNavigation({ waitUntil: 'networkidle0' }),
		page.locator('input[type=submit]').click(),
	]);
}
