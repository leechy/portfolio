import { deLocalizeUrl } from '$lib/paraglide/runtime';

export const reroute = (request: { url: string }) => deLocalizeUrl(request.url).pathname;
