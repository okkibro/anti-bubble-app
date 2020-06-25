/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

export const milestones = [
    {
        index: 0,
        name: "Beginner",
        maxValue: 1,
        description: "Voor het eerst een minigame gespeeld"
    },
    {
        index: 1,
        name: "Kleine Spaarder",
        maxValue: 10,
        description: "10 munten verzameld"
    },
    {
        index: 2,
        name: "Gierige Gerrie",
        maxValue: 1,
        description: "1 item uit de shop gekocht"
    },
    {
        index: 3,
        name: "Nieuwsgierige Niels",
        maxValue: 1,
        description: "Gekeken naar je bubbel geschiedenis"
    },
    {
        index: 4,
        name: "Shoppaholic",
        maxValue: 158, //todo: dit getal correct de hoeveelheid items in de shop laten representeren
        description: "Alle items uit de shop gekocht"
    },
    {
        index: 5,
        name: "Het glas is halfvol",
        maxValue: 50,
        description: "50% kennis over filter bubbels behaald"
    },
    {
        index: 6,
        name: "Snelheidsmonster",
        maxValue: 1,
        description: "Als snelste een minigame geëindigd"
    },
    {
        index: 7,
        name: "Money Maker",
        maxValue: 100,
        description: "100 munten verzameld"
    },
    {
        index: 8,
        name: "3/4 Trofee",
        maxValue: 75,
        description: "75% van al je trofeeën behaald"
    }
]

export function beforeUnload(e:any) {
    e.returnValue = "Weet je zeker dat je de sessie wilt verlaten?";
    return "Weet je zeker dat je de sessie wilt verlaten?";
}
/** This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course. © Copyright Utrecht University (Department of Information and Computing Sciences)  */
