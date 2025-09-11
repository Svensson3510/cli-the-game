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
const KL = new GlobalKeyboardListener()

// Declarations
let Sleep = (ms) => new Promise((r) => setTimeout(r, ms))
let CoinsSleep = (ms = (8/idleSpeed) * 100) => new Promise((r) => setTimeout(r, ms))
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
let idle = false
let manual = false
let accuireType = 'Auto'
let cPressed = false
let idleSpeed = 1
let idleSpeedUpgradeCost = 50

// Enemies
let spearmenStats = JSON.parse(fs.readFileSync('./enemies/spearmen.json', 'utf-8'))

async function ShowEnemyStats(x) {
    let enemyStats = Object.entries(x).map(([a, b]) => {return ` ${a}: ${b}`})
    return enemyStats
} 

// Function for printing character name with figlet and logging stats
async function NameStats() {
    figlet(name, (error, data) => {
        if (error) {
            console.log('Error!', error)
        }
        else {
            console.log(data)
        }
    })
    await Sleep(100)
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
await Sleep(3000)

// Create character
async function CreateCharacter() {
    console.clear()
    figlet('Create character', (error, data) => {
        if (error) {
            console.log('Error!', error)
        }
        else {
            console.log(data)
        }
    })
    await Sleep(100)
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
    NameStats()
    await Sleep(100)
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
    MainMenu()
}
CreateCharacter()

// Main menu
async function MainMenu() {
    console.clear()
    await NameStats()
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
        Idle()
    }
    else if (mainMenuAction == 'Fight') {
        Fight()
    }
    else if (mainMenuAction == 'Upgrade') {
        Upgrade()
    }
}

// Idle
async function Idle() {
    idle = true
    console.clear()
    KL.addListener(async function CoinSwitch(a) {
        if (idle == false) {
            KL.removeListener(CoinSwitch)
        }
        else if (a.name == "S" && a.state == "DOWN") {
            if (manual == true) {
                manual = false
                await Sleep(100)
                accuireType = 'Auto'
            }
            else if (manual == false) {
                manual = true
                await Sleep(100)
                accuireType = 'Manual'
            }
        }
    })
    KL.addListener(async function Accuire(b) {
        if (idle == false) {
            KL.removeListener(Accuire)
        }
        else if (b.name == "C" && b.state == "UP" && manual == true && cPressed == true) {
            cPressed = false
        }
        else if (b.name == "C" && b.state == "DOWN" && manual == true && cPressed == false) {
            coins++
            cPressed = true
        }
    })
    KL.addListener(async function Exit(c) {
        if (c.name == "E" && c.state == "DOWN") {
            manual = false
            accuireType = 'Auto'
            idle = false
            KL.removeListener(Exit)
            console.log('Exiting...')
            await Sleep(500)
            MainMenu()
        }
    })
    while (idle == true) {
        logUpdate(`
${boxen(`${coins}`, {title: 'Coins', titleAlignment: 'left', padding: 1, margin: 1})}

    Idle Speed: ${idleSpeed}

    ${accuireType} ${manual == true ? '(press C)':''}

    Press S to switch between Manual and Auto

    Press E to exit
        `)
        if (idle == false) {
            null
        }
        else if (idle == true && manual == false) {
            coins++
            await CoinsSleep()
        }
        else if (idle == true && manual == true) {
            await Sleep(100)
        }
    }
}

// Fight
async function Fight() {
    console.clear()
    await NameStats()
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
        Spearmen()
    }
    else if (fightAction == 'Back') {
        MainMenu()
    }
}

// Spearmen
async function Spearmen() {
    console.clear()
    await NameStats()
    const inqSpearmen = await inquirer.prompt({
        name: 'spearmen',
        type: 'list',
        message: `${chalk.yellow('Spearmen', await ShowEnemyStats(spearmenStats))}`,
        choices: [
            'Attack',
            'Back'
        ]
    })
    spearmenAction = inqSpearmen.spearmen
    if (spearmenAction == 'Attack') {
        console.log('Attacking')
        spearmenStats.Health = spearmenStats.Health - 1
        await Sleep(500)
        Spearmen()
    }
    else if (spearmenAction == 'Back') {
        Fight()
    }
}

// Upgrade
async function Upgrade() {
    console.clear()
    await NameStats()
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
            await Sleep(2000)
            Upgrade()
        }
        else if (coins >= idleSpeedUpgradeCost) {
            coins = coins - idleSpeedUpgradeCost
            idleSpeedUpgradeCost = Math.floor(idleSpeedUpgradeCost * 1.2)
            idleSpeed = idleSpeed + 1
            Upgrade()
        }
        else {
            console.log('Not enough Coins!')
            await Sleep(2000)
            Upgrade()
        }
    }
    else if (upgradeAction == 'Back') {
        MainMenu()
    }
}