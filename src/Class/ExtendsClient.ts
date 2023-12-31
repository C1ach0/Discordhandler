import Discord, {
    Client,
    Partials,
    Collection
} from "discord.js"
import {ClientOptions, Folder, Config} from "../Interfaces/ClientOptions";
import RegisterEvents from "../Handler/events";
import RegisterCommands from "../Handler/commands";
import RegisternteractionCommands from "../Handler/interactionCommand";
import RegisterButtons from "../Handler/buttons";
import Node from "../Listeners/Node";

export default class ExtendsClient extends Client {

    public readonly Config: Config;
    public commands: Collection<String, any> = new Collection();
    public buttons: Collection<String, any> = new Collection();
    public invites: Collection<String, any> = new Collection();
    public snipes: Collection<String, any> = new Collection();

    constructor(options: ClientOptions) {
        super(options?.client || {
            intents: 3249151,
            failIfNotExists: false,
            partials: [
                Partials.Channel,
                Partials.GuildMember,
                Partials.GuildScheduledEvent,
                Partials.Message,
                Partials.Reaction,
                Partials.ThreadMember,
                Partials.User
            ]   
        });
        this.Config = options.config;
        this.start();
        this.startHandler(options.folder);
    }

    /**
     * Lancement du bot
     */
    start() {
        this.login(this.Config.bot.token);
        Node();
    }

    startHandler(folder: Folder) {
        if(folder.events) RegisterEvents(this, folder.events);
        // if(folder.commands) RegisterCommands(this, folder.commands);
        if(folder.interactions.commands) RegisternteractionCommands(this, folder.interactions.commands);
        if(folder.interactions.buttons) RegisterButtons(this, folder.interactions.buttons);
    }
}