import { type PuppeteerLaunchOptions, type Viewport } from 'puppeteer';
import UserAgent from 'user-agents';

export const BLOCKED_TYPES = new Set<string>([
	'cspviolationreport',
	'eventsource',
	'font',
	'image',
	'manifest',
	'media',
	'other',
	'ping',
]);

export const DEFAULT_VIEWPORT: Viewport = { height: 1_080, width: 1_920 };

export const PUPPETEER_ARGS: PuppeteerLaunchOptions = {
	args: [
		'--autoplay-policy=user-gesture-required',
		'--disable-background-networking',
		'--disable-background-timer-throttling',
		'--disable-backgrounding-occluded-windows',
		'--disable-blink-features=AutomationControlled',
		'--disable-breakpad',
		'--disable-client-side-phishing-detection',
		'--disable-component-update',
		'--disable-default-apps',
		'--disable-dev-shm-usage',
		'--disable-domain-reliability',
		'--disable-extensions',
		'--disable-features=AudioServiceOutOfProcess',
		'--disable-gpu',
		'--disable-hang-monitor',
		'--disable-ipc-flooding-protection',
		'--disable-offer-store-unmasked-wallet-cards',
		'--disable-popup-blocking',
		'--disable-print-preview',
		'--disable-prompt-on-repost',
		'--disable-renderer-backgrounding',
		'--disable-setuid-sandbox',
		'--disable-speech-api',
		'--disable-sync',
		'--disable-translate',
		'--force-device-scale-factor',
		'--hide-scrollbars',
		'--ignore-gpu-blacklist',
		'--metrics-recording-only',
		'--mute-audio',
		'--no-default-browser-check',
		'--no-first-run',
		'--no-pings',
		'--no-sandbox',
		'--no-zygote',
		'--password-store=basic',
		'--safebrowsing-disable-auto-update',
		'--use-gl=swiftshader',
		'--use-mock-keychain',
		'--single-process',
	],
	devtools: false,
	headless: true,
};

export const USER_AGENT = new UserAgent({
	deviceCategory: 'desktop',
	platform: 'Linux x86_64',
});
