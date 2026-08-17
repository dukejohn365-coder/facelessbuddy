/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as admin from "../admin.js";
import type * as auth from "../auth.js";
import type * as channels from "../channels.js";
import type * as channelsBackfill from "../channelsBackfill.js";
import type * as channelsThumbnails from "../channelsThumbnails.js";
import type * as competitors from "../competitors.js";
import type * as discovery from "../discovery.js";
import type * as discoveryInternal from "../discoveryInternal.js";
import type * as http from "../http.js";
import type * as keywords from "../keywords.js";
import type * as outliers from "../outliers.js";
import type * as savedChannels from "../savedChannels.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  admin: typeof admin;
  auth: typeof auth;
  channels: typeof channels;
  channelsBackfill: typeof channelsBackfill;
  channelsThumbnails: typeof channelsThumbnails;
  competitors: typeof competitors;
  discovery: typeof discovery;
  discoveryInternal: typeof discoveryInternal;
  http: typeof http;
  keywords: typeof keywords;
  outliers: typeof outliers;
  savedChannels: typeof savedChannels;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {
  betterAuth: import("@convex-dev/better-auth/_generated/component.js").ComponentApi<"betterAuth">;
};
