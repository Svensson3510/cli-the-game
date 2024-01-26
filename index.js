#!/usr/bin/env node

// Imports
import boxen from 'boxen'
import chalk from 'chalk'
import figlet from 'figlet'
import inquirer from 'inquirer'

// Declarations
const sleep3s = (ms = 3000) => new Promise((r) => setTimeout(r, ms))
const sleep100ms = (ms = 100) => new Promise((r) => setTimeout(r, ms))
let name
let improvement
let mainMenuAction
let idleAction
let fightAction
let upgradeAction
let health = 100
let attack = 100
let defence = 100
let speed = 100

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

    `)
}

// Startup
figlet('cli-game', (error, data) => {
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
            '+10 Health',
            '+10 Attack',
            '+10 Defence',
            '+10 Speed'
        ]
    })
    improvement = inqImprovement.improvement
    if (improvement === '+10 Health') {
        health = 110
    }
    else if (improvement === '+10 Attack') {
        attack = 110
    }
    else if (improvement === '+10 Defence') {
        defence = 110
    }
    else if (improvement === '+10 Speed') {
        speed = 110
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
    if (mainMenuAction === 'Idle') {
        idle()
    }
    else if (mainMenuAction === 'Fight') {
        fight()
    }
    else if (mainMenuAction === 'Upgrade') {
        upgrade()
    }
}

// Idle
async function idle() {
    console.clear()
    await nameStats()
    const inqIdle = await inquirer.prompt({
        name: 'idle',
        type: 'list',
        message: `${chalk.yellow('Idle')}`,
        choices: [
            'Idle',
            'Back'
        ]
    })
    idleAction = inqIdle.idle
    if (idleAction === 'Idle') {
        console.log('Idling')
    }
    else if (idleAction === 'Back') {
        mainMenu()
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
    if (fightAction === 'Fight') {
        console.log('Fighting')
    }
    else if (fightAction === 'Back') {
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
            'Upgrade',
            'Back'
        ]
    })
    upgradeAction = inqUpgrade.upgrade
    if (upgradeAction === 'Upgrade') {
        console.log('Upgrading')
    }
    else if (upgradeAction === 'Back') {
        mainMenu()
    }
}