import { Colour } from "openrct2-flexui";


export function getWindow(title: string): Window | null {
    for (let i = 0; i < ui.windows; i++) {
        if (ui.getWindow(i).title === title) return ui.getWindow(i);
    }
    return null;
}

export function setSpeed(speed: number): void
{
    return context.sharedStorage.set("snake.speed", speed);
}

export function getSpeed(): number
{
    return context.sharedStorage.get("snake.speed", 2);
}

export function setColour(key: string, colour: Colour): void
{
    return context.sharedStorage.set(key, colour);
}

export function getColour(key: string): Colour
{
    return context.sharedStorage.get(key, 0);
}

export function setMenuItem(isPinned: boolean): void
{
    return context.sharedStorage.set("snake.pinned", isPinned);
}

export function getMenuItem(): boolean
{
    return context.sharedStorage.get("snake.pinned", false);
}

export function setHighscore(score: number[]): void
{
    return context.sharedStorage.set("snake.highscore", score);
}

export function getHighscore(): number[]
{
    return context.sharedStorage.get("snake.highscore", [0, 0, 0, 0]);
}