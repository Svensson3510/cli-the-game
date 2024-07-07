#!/usr/bin/env node

// Imports
import boxen from 'boxen'
import chalk from 'chalk'
import figlet from 'figlet'
import inquirer from 'inquirer'
import logUpdate from 'log-update'
import { GlobalKeyboardListener } from 'node-global-key-listener'

// Keyboard listener
const kl = new GlobalKeyboardListener()

// Declarations
const sleep3s = (ms = 3000) => new Promise((r) => setTimeout(r, ms))
const sleep2s = (ms = 2000) => new Promise((r) => setTimeout(r, ms))
const sleep500ms = (ms = 500) => new Promise((r) => setTimeout(r, ms))
const sleep100ms = (ms = 100) => new Promise((r) => setTimeout(r, ms))
let coinsSleep = (ms = defaultTime - (idleSpeed * 100)) => new Promise((r) => setTimeout(r, ms))
let name
let improvement
let mainMenuAction
let fightAction
let upgradeAction
let health = 10
let attack = 10
let defence = 10
let speed = 10
let coins = 0
let idle = false
let manual = false
let accuireType = 'Auto'
let cPressed = false
let defaultTime = 2000
let idleSpeed = 1
let idleSpeedUpgradeCost = 50

// Function for printing character name with figlet and logging stats
async function nameStats() {
    figlet(name, (error, data) => {
        if (error) {
            console.log('Error!', error)
        }
        else {
            console.log(data)
        }
    })
    await sleep100ms()
    console.log(`
Health: ${health}   Attack: ${attack}   Defence: ${defence}   Speed: ${speed}

Idle Speed: ${idleSpeed}   Coins: ${coins}
    `)
}

// Startup
figlet('cli-the-game', (error, data) => {
    if (error) {
        console.log('Error!', error)
    }
    else {
        console.log(data)
    }
})
await sleep3s()

// Create character
async function createCharacter() {
    console.clear()
    figlet('Create character', (error, data) => {
        if (error) {
            console.log('Error!', error)
        }
        else {
            console.log(data)
        }
    })
    await sleep100ms()
    const inqName = await inquirer.prompt({
        name: 'name',
        type: 'input',
        message: `${chalk.yellow('Character name')}`,
        default() {
            return 'Player'
        }
    })
    name = inqName.name
    console.clear()
    nameStats()
    await sleep100ms()
    const inqImprovement = await inquirer.prompt({
        name: 'improvement',
        type: 'list',
        message: `${chalk.yellow('Select improvement')}`,
        choices: [
            '+5 Health',
            '+5 Attack',
            '+5 Defence',
            '+5 Speed'
        ]
    })
    improvement = inqImprovement.improvement
    if (improvement == '+5 Health') {
        health = 15
    }
    else if (improvement == '+5 Attack') {
        attack = 15
    }
    else if (improvement == '+5 Defence') {
        defence = 15
    }
    else if (improvement == '+5 Speed') {
        speed = 15
    }
    mainMenu()
}
createCharacter()

// Main menu
async function mainMenu() {
    console.clear()
    await nameStats()
    const inqMainMenu = await inquirer.prompt({
        name: 'main_menu',
        type: 'list',
        message: `${chalk.yellow('Main menu')}`,
        choices: [
            'Idle',
            'Fight',
            'Upgrade'
        ]
    })
    mainMenuAction = inqMainMenu.main_menu
    if (mainMenuAction == 'Idle') {
        idle()
    }
    else if (mainMenuAction == 'Fight') {
        fight()
    }
    else if (mainMenuAction == 'Upgrade') {
        upgrade()
    }
}

// Idle
async function idle() {
    idle = true
    console.clear()
    kl.addListener(async function coinSwitch(a) {
        if (idle == false) {
            kl.removeListener(coinSwitch)
        }
        else if (a.name == "S" && a.state == "DOWN") {
            if (manual == true) {
                manual = false
                await sleep100ms()
                accuireType = 'Auto'
            }
            else if (manual == false) {
                manual = true
                await sleep100ms()
                accuireType = 'Manual'
            }
        }
    })
    kl.addListener(async function accuire(b) {
        if (idle == false) {
            kl.removeListener(accuire)
        }
        else if (b.name == "C" && b.state == "UP" && manual == true && cPressed == true) {
            cPressed = false
        }
        else if (b.name == "C" && b.state == "DOWN" && manual == true && cPressed == false) {
            coins++
            cPressed = true
        }
    })
    kl.addListener(async function exit(c) {
        if (c.name == "E" && c.state == "DOWN") {
            manual = false
            accuireType = 'Auto'
            idle = false
            kl.removeListener(exit)
            console.log('Exiting...')
            await sleep3s()
            mainMenu()
        }
    })
    while (idle == true) {
        logUpdate(`
${boxen(`${coins}`, {title: 'Coins', titleAlignment: 'left', padding: 1, margin: 1})}

    Idle Speed: ${idleSpeed}

    ${accuireType}

    Press S to switch to manually accuire coins by pressing C

    Press S again to switch back to auto

    Press E to exit
        `)
        if (idle == false) {
            null
        }
        else if (idle == true && manual == false) {
            coins++
            await coinsSleep()
        }
        else if (idle == true && manual == true) {
            await sleep100ms()
        }
    }
}

// Fight
async function fight() {
    console.clear()
    await nameStats()
    const inqFight = await inquirer.prompt({
        name: 'fight',
        type: 'list',
        message: `${chalk.yellow('Fight')}`,
        choices: [
            'Fight',
            'Back'
        ]
    })
    fightAction = inqFight.fight
    if (fightAction == 'Fight') {
        console.log('Fighting')
    }
    else if (fightAction == 'Back') {
        mainMenu()
    }
}

// Upgrade
async function upgrade() {
    console.clear()
    await nameStats()
    const inqUpgrade = await inquirer.prompt({
        name: 'upgrade',
        type: 'list',
        message: `${chalk.yellow('Upgrade')}`,
        choices: [
            `Idle Speed, ${idleSpeed == 20 ? '(Fully upgraded)':`${idleSpeedUpgradeCost} Coins`}`,
            'Back'
        ]
    })
    upgradeAction = inqUpgrade.upgrade
    if (upgradeAction == `Idle Speed, ${idleSpeed == 20 ? '(Fully upgraded)':`${idleSpeedUpgradeCost} Coins`}`) {
        if (defaultTime - (idleSpeed * 100) <= 0) {
            console.log('Fully upgraded!')
            await sleep2s()
            upgrade()
        }
        else if (coins >= idleSpeedUpgradeCost) {
            coins = coins - idleSpeedUpgradeCost
            idleSpeedUpgradeCost = Math.floor(idleSpeedUpgradeCost * 1.2)
            idleSpeed = idleSpeed + 1
            upgrade()
        }
        else {
            console.log('Not enough Coins!')
            await sleep2s()
            upgrade()
        }
    }
    else if (upgradeAction == 'Back') {
        mainMenu()
    }
}