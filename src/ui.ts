import { absolute, button, checkbox, Colour, colourPicker, compute, dropdownSpinner, groupbox, horizontal, label, listview, store, tab, tabwindow, vertical } from "openrct2-flexui";
import { array, canvas, colourFood, colourSnake, createPicker, gamespeed, gridSizeX, gridSizeY, highscore, isMoving, oldRecord, onClose, onOpen, pixelSize, resetHighscores, score, setOldRecord } from "./gameplay.js";
import { getColour, getHighscore, getMenuItem, getSpeed, getWindow, setColour, setMenuItem, setSpeed } from "./settings.js";

const tabOffset = 43 + 14 + 12 + 10;
const windowHeight = gridSizeY.get() * pixelSize.get() + tabOffset;
const windowWidth = gridSizeX.get() * pixelSize.get() + 12;
const colour = {
    primary: store<Colour>(getColour("snake.colour.primary")),
    secondary: store<Colour>(getColour("snake.colour.secondary")),
}

export const isPinned = store<boolean>(getMenuItem());

export const windowGame = tabwindow({
    title: "Snake",
    position: "center",
    colours: [
        colour.primary.get(),
        colour.secondary.get(),
        colour.primary.get()
    ],
    height: windowHeight,
    width: windowWidth,
    tabs: [
        tab({
            image: { frameBase: context.getIcon("search"), frameCount: 1, frameDuration: 4, offset: { x: 4, y: 1 } },
            content: [
                absolute({
                    width: gridSizeX.get() * pixelSize.get(),
                    height: gridSizeY.get() * pixelSize.get(),
                    content: [
                        horizontal({
                            x: 0,
                            y: 0,
                            width: "100%",
                            height: "100%",
                            content: [
                                label({
                                    text: compute(score, s =>  "Score: " + s.toString()),
                                }),
                                label({
				                    padding: {left: "1w"},
                                    text: compute(score, highscore, gamespeed, (s, h, g) => {
                                        let colour = "";
                                        console.log(oldRecord);
                                        if (s > oldRecord) {
                                            colour = "{YELLOW}"
                                        }
                                        else colour = "";
                                        return colour + "Highscore: " + h[g].toString()
                                    }),
                                }),
                            ]
                        }),
                        horizontal({
                            x: 0,
                            y: 14,
                            width: "100%",
                            height: "100%",
                            spacing: 0,
                            content: array(gridSizeX.get(), x => vertical({
                                spacing: 0,
                                content: array(gridSizeY.get(), y => createPicker(canvas[x][y]))
                            })),
                        }),
                        label({
                            x: 0,
                            y: "104.5%",
                            width: "100%",
                            height: "100%",
                            alignment: "centred",
                            text: "{BLACK}Manticore-007 © 2026",
                        }),
                        label({
                            x: 0,
                            y: 0,
                            width: "100%",
                            height: "100%",
                            alignment: "centred",
                            text: compute(isMoving, m => !m ? labelStart() : ""),
                        }),
                    ]
                }),
            ],
        }),
        tab({
            image: { frameBase: 5511, frameCount: 16, frameDuration: 4 },
            height: 230,
            width: 260,
            content: [
                groupbox({
                    text: "Highscores:",
                    height: 165,
                    content: [
                        horizontal([
                            listview({
                                scrollbars: "none",
                                columns: ["{WINDOW_COLOUR_2}Difficulty", "{WINDOW_COLOUR_2}Score"],
                                items: 
                                    compute(highscore, h => [
                                        ["Ludicrous speed: ",`{BLACK}${h[3]}`],
                                        ["Fast speed: ", `{BLACK}${h[2]}`],
                                        ["Medium speed: ", `{BLACK}${h[1]}`],
                                        ["Slow speed:", `{BLACK}${h[0]}`]
                                    ]
                                )                                
                            })
                        ]),
                    ]
                })
            ],
        }),
        tab({   //options
            image: { frameBase: 5201, frameCount: 4, frameDuration: 4 }, //gear
            height: 230,
            width: 260,
            content: [
                groupbox({
                    text: "Options",
                    content: [
                        checkbox({
                            text: "Pin to top in menu    {RED}(Requires reload of park)",
                            isChecked: isPinned,
                            onChange: (checked) => {
                                isPinned.set(checked);
                                setMenuItem(checked);
                            }
                        }),
                        horizontal([
                            label({ text: "{BLACK}Speed:" }),
                            dropdownSpinner({
                                items: ["Slow", "Medium", "Fast", "Ludicrous"],
                                selectedIndex: getSpeed(),
                                onChange: (number) => {
                                    setSpeed(number);
                                    gamespeed.set(getSpeed());
                                    setOldRecord(getHighscore()[number]);
                                }
                            })
                        ]),
                        button({
                            text: "Reset highscores",
                            height: 14,
                            width: "60%",
                            padding: { top: 4, left: "1w" },
                            onClick: resetHighscores
                        })
                    ]
                }),
                groupbox({
                    text: "Colours",
                    spacing: 0,
                    content: [
                        horizontal([
                            label({ text: "{BLACK}Window:" }),
                            colourPicker({
                                colour: colour.primary,
                                onChange: (c) => {
                                    colour.primary.set(c);
                                    setColour("snake.colour.primary", c);
                                }
                            }),
                            colourPicker({
                                colour: colour.secondary,
                                onChange: (c) => {
                                    colour.secondary.set(c);
                                    setColour("snake.colour.secondary", c);
                                }
                            }),
                        ]),
                        horizontal([
                            label({ text: "{BLACK}Snake:" }),
                            colourPicker({
                                colour: colourSnake,
                                onChange: (c) => {
                                    colourSnake.set(c);
                                    setColour("snake.colour.snake", c);
                                }
                            }),
                        ]),
                        horizontal([
                            label({ text: "{BLACK}Food:" }),
                            colourPicker({
                                colour: colourFood,
                                onChange: (c) => {
                                    colourFood.set(c);
                                    setColour("snake.colour.food", c);
                                }
                            }),
                        ]),
                        button({
                            text: "Reset to default colours",
                            height: 14,
                            width: "60%",
                            padding: { top: 4, left: "1w" },
                            onClick: () => {
                                colour.primary.set(Colour.AquaDark);
                                colour.secondary.set(Colour.LightBrown);
                                colourSnake.set(Colour.GrassGreenDark);
                                colourFood.set(Colour.SaturatedRed);
                                setColour("snake.colour.primary", Colour.AquaDark);
                                setColour("snake.colour.secondary", Colour.LightBrown);
                                setColour("snake.colour.snake", Colour.GrassGreenDark);
                                setColour("snake.colour.food", Colour.SaturatedRed);
                            }
                        })
                    ]
                }),
            ]
        }),
        tab({
            image: { frameBase: 5367, frameCount: 8, frameDuration: 4 }, //info
            height: 230,
            width: 260,
            content: [
                label({ text: "Snake, a plugin for OpenRCT2", alignment: "centred", padding: [4, 0, 8, 0] }),
                horizontal([
                    label({ text: "Version:" + "\n\nAuthor:" + "\n\nUI:" + "\n\nSpecial\nThanks:" + "\n\n", width: "25%" }),
                    label({ text: "{BLACK}2026.06.07" + `\n\n{BLACK}Manticore-007` + `\n\n{BLACK}FlexUI by Basssiiie` + `\n\n{BLACK}Basssiiie, {BLACK}Sadret` })
                ]),
                label({ text: "https://github.com/Manticore-007\n/OpenRCT2-Snake", padding: ["90%", 0, 0, 0], alignment: "centred" })
            ]
        }),
    ],
    onOpen: () => onOpen(),
    onClose: () => onClose(),
    onUpdate: () => {
        const window = getWindow("Snake");
        if (window) {
            window.colours = [
                getColour("snake.colour.primary"),
                getColour("snake.colour.secondary"),
                getColour("snake.colour.primary")
            ]
        }
    }
});

function labelStart(): string {
    const text = "\n";
    return text.repeat(windowHeight / 12) + "{WHITE}Hold CTRL and use the ARROW KEYS to control the snake";
}