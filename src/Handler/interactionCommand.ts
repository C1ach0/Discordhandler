import InteractionCommandExecutor from '../Executor/InteractionCommandExecutor';
import ExtendsClient from "../Class/ExtendsClient";
import { InteractionCommandAnnotation, _InteractionCommand } from '../Annotations/_InteractionCommands';
import {
    ApplicationCommandType,
    PermissionsBitField
} from "discord.js";
import fs, { statSync } from "fs";
import { join } from "path";
import chalk from "chalk";
import 'reflect-metadata';
import { Routes } from 'discord-api-types/v9';
import { REST } from '@discordjs/rest';
import { Logger } from "../Class/Logger";
const logger = new Logger();

export default function RegisternteractionCommands(client: ExtendsClient, dir: string) {
    logger.sendLog("SUCCESS", "Initializations of interactions commands")
    const CommandDir: string = join(__dirname, '..', dir);
    loadCommand(client, CommandDir);
}

function loadCommand(client: ExtendsClient, dir: string) {
    const slashCommands = [];
    fs.readdirSync(dir).forEach(async (file) => {
        const filePath = join(dir, file);
        const stat = statSync(filePath);
        if (stat.isDirectory()) {
            loadCommand(client, filePath);
        } else if (file.endsWith('.js') || file.endsWith('.ts')) {
            const CommandClass = require(filePath).default;
            const commandAnnotation: InteractionCommandAnnotation = Reflect.getMetadata('_InteractionCommand', CommandClass);
            if (commandAnnotation) {
                slashCommands.push({
                    name: commandAnnotation.name,
                    description: commandAnnotation.description,
                    type: ApplicationCommandType.ChatInput,
                    options: commandAnnotation.options ? commandAnnotation.options : null,
                    default_member_permissions: commandAnnotation.member_permission ? PermissionsBitField.resolve(commandAnnotation.member_permission).toString() : null
                })
                if(commandAnnotation.name) {
                    client.commands.set(commandAnnotation.name, CommandClass)
                } else {
                    console.log("no name")
                }
                // const eventListenerInstance: InteractionCommandExecutor = new CommandClass();
                console.log(chalk.green(`Command '${commandAnnotation.name}' registered.`));
            } else {
                console.log(chalk.yellow(`File '${file}' does not have a valid _Command annotation.`));
            }
        } else {
            console.log("pas lu : ", file)
        }
    })
    Routing(client, slashCommands);
}

async function Routing(client: ExtendsClient, slashCommands: any[]) {
    const rest = new REST({ version: '10' }).setToken(client.token);
    try {
        await rest.put(
            client.Config?.guild?.id ?
                Routes.applicationGuildCommands(client.Config.bot.id, client.Config?.guild?.id) :
                Routes.applicationCommands(client.Config.bot.id),
            { body: slashCommands }
        );
        // console.log("body push", slashCommands)
    } catch (error) {
        console.log(error);
    };
}

