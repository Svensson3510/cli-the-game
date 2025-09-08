#!/usr/bin/env node

// Imports
import boxen from 'boxen'
import chalk from 'chalk'
import figlet from 'figlet'
import inquirer from 'inquirer'
import logUpdate from 'log-update'
import { GlobalKeyboardListener } from 'node-global-key-listener'
import fs from 'fs'

// Keyboard listener
const kl = new GlobalKeyboardListener()

// Declarations
const sleep3s = (ms = 3000) => new Promise((r) => setTimeout(r, ms))
const sleep2s = (ms = 2000) => new Promise((r) => setTimeout(r, ms))
const sleep500ms = (ms = 500) => new Promise((r) => setTimeout(r, ms))
const sleep100ms = (ms = 100) => new Promise((r) => setTimeout(r, ms))
let coinsSleep = (ms = (8/idleSpeed) * 100) => new Promise((r) => setTimeout(r, ms))
let name
let improvement
let mainMenuAction
let fightAction
let spearmenAction
let upgradeAction
let health = 10
let attack = 10
let defence = 10
let speed = 10
let coins = 1000000
let idl = false
let manual = false
let accuireType = 'Auto'
let cPressed = false
let idleSpeed = 1
let idleSpeedUpgradeCost = 50

// Enemies
let spearmenStats = JSON.parse(fs.readFileSync('./enemies/spearmen.json', 'utf-8'))

async function showEnemyStats(x) {
    let enemyStats = Object.entries(x).map(([a, b]) => {return ` ${a}: ${b}`})
    return enemyStats
} 

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
    idl = true
    console.clear()
    kl.addListener(async function coinSwitch(a) {
        if (idl == false) {
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
        if (idl == false) {
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
            idl = false
            kl.removeListener(exit)
            console.log('Exiting...')
            await sleep500ms()
            mainMenu()
        }
    })
    while (idl == true) {
        logUpdate(`
${boxen(`${coins}`, {title: 'Coins', titleAlignment: 'left', padding: 1, margin: 1})}

    Idle Speed: ${idleSpeed}

    ${accuireType} ${manual == true ? '(press C)':''}

    Press S to switch between Manual and Auto

    Press E to exit
        `)
        if (idl == false) {
            null
        }
        else if (idl == true && manual == false) {
            coins++
            await coinsSleep()
        }
        else if (idl == true && manual == true) {
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
            'Spearmen',
            'Back'
        ]
    })
    fightAction = inqFight.fight
    if (fightAction == 'Spearmen') {
        spearmen()
    }
    else if (fightAction == 'Back') {
        mainMenu()
    }
}

// Spearmen
async function spearmen() {
    console.clear()
    await nameStats()
    const inqSpearmen = await inquirer.prompt({
        name: 'spearmen',
        type: 'list',
        message: `${chalk.yellow('Spearmen', await showEnemyStats(spearmenStats))}`,
        choices: [
            'Attack',
            'Back'
        ]
    })
    spearmenAction = inqSpearmen.spearmen
    if (spearmenAction == 'Attack') {
        console.log('Attacking')
        spearmenStats.Health = spearmenStats.Health - 1
        await sleep500ms()
        spearmen()
    }
    else if (spearmenAction == 'Back') {
        fight()
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
        if (idleSpeed == 20) {
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