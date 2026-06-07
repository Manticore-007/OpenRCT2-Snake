import { compute, store } from "openrct2-flexui";
import { isPinned, windowGame } from "./ui.js";

const title = store<string>("Snake");
const menuLabel = compute(isPinned, p => (p) ? `- ${title.get()}` : title.get())

function onClickMenuItem()
{
	// Write code here that should happen when the player clicks the menu item under the map icon.

	windowGame.open();
}


export function startup()
{
	// Write code here that should happen on startup of the plugin.
	console.log(["\x1b[1;33m" + "Snake initialized" + "\x1b[0m"]);

	// Register a menu item under the map icon:
	if (typeof ui !== "undefined") ui.registerMenuItem(menuLabel.get(), () => onClickMenuItem());
}