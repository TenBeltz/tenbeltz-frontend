#!/usr/bin/env node
/**
 * IndexNow submission — notifies Bing, Yandex, Naver and Seznam that URLs changed.
 *
 * WHEN TO RUN
 *   Manually, AFTER a deploy has gone live on https://tenbeltz.com.
 *   Deliberately NOT wired into `npm run build`: the build also runs locally and in CI,
 *   and submitting URLs from a machine whose changes are not published yet is wrong
 *   (search engines would recrawl and find the old content).
 *
 * HOW TO RUN
 *   node scripts/indexnow.mjs              # submit every URL in the live sitemap
 *   node scripts/indexnow.mjs --dry-run    # print the payload, submit nothing
 *   node scripts/indexnow.mjs --url https://tenbeltz.com/services   # single URL (repeatable)
 *
 * PREREQUISITE
 *   https://tenbeltz.com/71a4fca7b2c2ecc77e724cb429e25350.txt must be publicly reachable
 *   and contain exactly the key below. That file is the ownership proof; without it the
 *   API answers 403. The script checks it before submitting.
 *
 * Protocol reference: https://www.indexnow.org/documentation
 * Submitting to one participating engine shares the signal with all of them.
 */

const KEY = '71a4fca7b2c2ecc77e724cb429e25350'
const HOST = 'tenbeltz.com'
const ORIGIN = `https://${HOST}`
const KEY_LOCATION = `${ORIGIN}/${KEY}.txt`
const SITEMAP_INDEX = `${ORIGIN}/sitemap-index.xml`
const ENDPOINT = 'https://api.indexnow.org/indexnow'

// Fallback list, used only if the live sitemap cannot be read. Mirrors the 10 routes
// that exist today (5 Spanish + 5 English). Keep in sync with src/pages/.
const FALLBACK_URLS = [
	`${ORIGIN}/`,
	`${ORIGIN}/services`,
	`${ORIGIN}/casos`,
	`${ORIGIN}/quien-esta-detras`,
	`${ORIGIN}/politicas`,
	`${ORIGIN}/en`,
	`${ORIGIN}/en/services`,
	`${ORIGIN}/en/case-studies`,
	`${ORIGIN}/en/who-is-behind`,
	`${ORIGIN}/en/politicas`,
]

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const explicitUrls = args.reduce((acc, arg, i) => {
	if (arg === '--url' && args[i + 1]) acc.push(args[i + 1])
	return acc
}, [])

const locs = (xml) => [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1])

async function fetchText(url) {
	const res = await fetch(url, { headers: { 'user-agent': 'tenbeltz-indexnow/1.0' } })
	if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`)
	return res.text()
}

/** Reads the live sitemap index and flattens every child sitemap into a URL list. */
async function urlsFromSitemap() {
	const index = await fetchText(SITEMAP_INDEX)
	const children = locs(index)
	if (children.length === 0) return []

	const pages = await Promise.all(children.map((child) => fetchText(child).then(locs)))
	return [...new Set(pages.flat())]
}

/** The API returns 403 if the key file is missing, so fail loudly and early instead. */
async function verifyKeyFile() {
	const body = (await fetchText(KEY_LOCATION)).trim()
	if (body !== KEY) {
		throw new Error(`Key file at ${KEY_LOCATION} contains "${body}", expected "${KEY}"`)
	}
}

async function main() {
	let urlList = explicitUrls

	if (urlList.length === 0) {
		try {
			urlList = await urlsFromSitemap()
			console.log(`Read ${urlList.length} URLs from ${SITEMAP_INDEX}`)
		} catch (err) {
			console.warn(`Could not read the sitemap (${err.message}); using the fallback list.`)
			urlList = FALLBACK_URLS
		}
	}

	// A URL outside the host makes the whole request fail with 422.
	const foreign = urlList.filter((url) => new URL(url).host !== HOST)
	if (foreign.length > 0) {
		throw new Error(`URLs outside ${HOST} cannot be submitted: ${foreign.join(', ')}`)
	}
	if (urlList.length === 0) throw new Error('No URLs to submit.')

	const payload = { host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList }

	if (dryRun) {
		console.log('--dry-run — nothing submitted. Payload:')
		console.log(JSON.stringify(payload, null, 2))
		return
	}

	await verifyKeyFile()

	const res = await fetch(ENDPOINT, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json; charset=utf-8' },
		body: JSON.stringify(payload),
	})

	// 200 = accepted, 202 = accepted but key still being validated. Both are success.
	if (res.status === 200 || res.status === 202) {
		console.log(`IndexNow accepted ${urlList.length} URLs (HTTP ${res.status}).`)
		return
	}

	const reasons = {
		400: 'Invalid request format.',
		403: `Key rejected — check that ${KEY_LOCATION} is reachable.`,
		422: 'URLs do not belong to the host, or the key does not match.',
		429: 'Rate limited — too many requests.',
	}
	throw new Error(`IndexNow returned ${res.status}. ${reasons[res.status] ?? ''} ${await res.text()}`.trim())
}

main().catch((err) => {
	console.error(`IndexNow submission failed: ${err.message}`)
	process.exit(1)
})
