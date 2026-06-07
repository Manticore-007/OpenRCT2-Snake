import { arrayStore, Colour, colourPicker, store, WritableStore } from "openrct2-flexui";
import { getColour, getHighscore, getSpeed, setHighscore } from "./settings.js";

type Pixel = WritableStore<Colour>;
type Canvas = Pixel[][];
type Cell = [x: number, y: number];

//variables of Playfield
const colourCanvas = Colour.Void;

export const pixelSize = store<number>(12);
export const gridSizeX = store<number>(40);
export const gridSizeY = store<number>(30);
export const canvas = createCanvas(gridSizeX.get(), gridSizeY.get());

const centerX = Math.floor(gridSizeX.get()/2);
const centerY = Math.floor(gridSizeY.get()/2);


//variables of Game
let tick: IDisposable;
const inputAllowed = store<boolean>(false);
export const gamespeed = store<number>(getSpeed());
export const score = store<number>(0);
export const highscore = arrayStore<number>([0, 0 ,0 ,0 ])
export let oldRecord = 0;

//variables of Snake
let snake: Cell[] = [];
export let direction: Cell = [0, 0];
export const colourSnake = store<Colour>(getColour("snake.colour.snake"));

export const isMoving = store<boolean>(false);
export const isGrowing = store<boolean>(false);

//variables of Food
let food: Cell | undefined;
export const colourFood = store<Colour>(getColour("snake.colour.food"));


export function onOpen() {
    inputAllowed.set(true);
    gameTick();
    initSnake();
    initHotkeys();
    highscore.set(getHighscore());
    oldRecord = getHighscore()[gamespeed.get()];
}

export function onClose() {
    tick.dispose();
    clearAllPixels(canvas);
    inputAllowed.set(false);
    direction = [0,0];
    isMoving.set(false);
}

export function death() {
    direction = [0,0];
    food = undefined;
    isMoving.set(false);
    score.set(0);
    clearAllPixels(canvas);
    initSnake();
    oldRecord = highscore.get()[gamespeed.get()];
}

export function initSnake() {
    snake = [[centerX,centerY]];
}

export function setOldRecord(input: number) {
    oldRecord = input;
}

export function createFood() {
    const randomX = Math.floor(Math.random() * (gridSizeX.get()-1));
    const randomY = Math.floor(Math.random() * (gridSizeY.get()-1));
    food = [randomX, randomY];
    if (snake.some(segment => food && segment[0] === food[0] && segment[1] === food[1])) {createFood()};
    setPixel(canvas, food, colourFood.get());
}

export function moveSnake(offset: Cell) {
    isMoving.set(true);
    if (offset[0] === -direction[0] && offset[1] === -direction[1]) return;
    direction = offset;
}

export function growSnake() {
    isGrowing.set(true);
}

/** checks if any of the cells is occupied */
function collides(cells: Cell[]) {
    return cells.some(
        cell => cell[0] < 0 || cell[0] >= gridSizeX.get() || cell[1] < 0 || cell[1] >= gridSizeY.get() || 
        snake.some(segment => segment[0] === cell[0] && segment[1] === cell[1] && snake.indexOf(segment) !== 0)
    );
}

function drawSnake() {
    const newHead = add(snake[0], direction);
    snake.unshift(newHead);
    if (food && newHead[0] === food[0] && newHead[1] === food[1]) {
        growSnake();
        calculateScore();
        snake.forEach(segment => setPixel(canvas, segment, Colour.White));
        context.setTimeout(blinkSnake, 100);
        createFood();
    };
    setPixel(canvas, newHead, colourSnake.get());
    if (!isGrowing.get()) {
        const oldTail = snake.pop();
        if (oldTail && isMoving) setPixel(canvas, oldTail);
    }
    isGrowing.set(false);
}

function blinkSnake(){
    snake.forEach(segment => setPixel(canvas, segment, colourSnake.get()));
}

function gameTick() {
    let i = 0
    tick = context.subscribe("interval.tick", () => {
        if (isMoving.get() && score.get() === 0 && !food) createFood();
        if (collides([add(snake[0], direction)])) death();
        i++;
        if (i === 4 - getSpeed()){
            drawSnake();
            i = 0;
        };
    });
}

function createPixel(): Pixel {
    return store(colourCanvas);
}

function createCanvas(w: number, h: number): Canvas {
    return array(w, () => array(h, () => createPixel()));
}

export function createPicker(pixel: Pixel) {
    return colourPicker({
        colour: pixel
    });
}

export function setPixel(canvas: Canvas, cell: Cell, c: Colour = colourCanvas) {
    const pixel = canvas[cell[0]]?.[cell[1]];
    if (!pixel) return;
    pixel.set(c);
}

function clearAllPixels(canvas: Canvas) {
    canvas.forEach(col => col.forEach(cell => cell.set(colourCanvas)));
}

function calculateScore() {
    let points = score.get();
    let hs = highscore.get();
    points++;
    if (points > getHighscore()[getSpeed()]){
        hs[getSpeed()] = points;
        highscore.set(hs);
    }
    score.set(points);
}

export function resetHighscores(): void {
    oldRecord = 0;
    highscore.set([0, 0, 0, 0]);
    setHighscore([0, 0, 0, 0])
}

export function setDirection(dir: Cell) {
    direction = dir;
}

function initHotkeys() {
    ui.registerShortcut({
        id: "rctsnake.left",
        text: "[RCTsnake] Move left",
        bindings: ["CTRL+LEFT"],
        callback: () => moveSnake([-1, 0]),
    });
    ui.registerShortcut({
        id: "rctsnake.right",
        text: "[RCTsnake] Move right",
        bindings: ["CTRL+RIGHT"],
        callback: () => moveSnake([1, 0]),
    });
    ui.registerShortcut({
        id: "rctsnake.up",
        text: "[RCTsnake] Move up",
        bindings: ["CTRL+UP"],
        callback: () => moveSnake([0, -1]),
    });
    ui.registerShortcut({
        id: "rctsnake.down",
        text: "[RCTsnake] Move down",
        bindings: ["CTRL+DOWN"],
        callback: () => moveSnake([0, 1]),
    });
}

/** adds two cells */
export function add(a: Cell, b: Cell): Cell {
    return [a[0] + b[0], a[1] + b[1]];
}

/** creates array of size `n` with elements given by `fun` */
export function array<T>(n: number, fun: (idx: number) => T): T[] {
    const arr = new Array(n);
    for (let idx = 0; idx < n; idx++)
        arr[idx] = fun(idx);
    return arr;
}