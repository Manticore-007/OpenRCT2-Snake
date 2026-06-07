/// <reference path="../lib/openrct2.d.ts" />

import { startup } from "./startup.js";

registerPlugin({
	name: "Snake",
	version: "0.1",
	authors: [ "Manticore-007" ],
	type: "local",
	licence: "MIT",
	/**
	 * This field determines which OpenRCT2 API version to use. It's best to always use the
	 * latest release version, unless you want to use specific versions from a newer develop
	 * version. Version 70 equals the v0.4.4 release.
	 * @see https://github.com/OpenRCT2/OpenRCT2/blob/v0.4.4/src/openrct2/scripting/ScriptEngine.h#L50
	 */
	targetApiVersion: 70,
	main: startup,
});