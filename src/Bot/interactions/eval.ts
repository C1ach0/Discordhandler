import { EmbedBuilder, PermissionFlagsBits, ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import { _InteractionCommand } from "../../Annotations/_InteractionCommands";
import ExtendsClient from "../../Class/ExtendsClient";
import CommandExecutor from "../../Executor/InteractionCommandExecutor";
import { InteractionCommandContext } from "../../Class/InteractionCommandContext";

@_InteractionCommand({
    name: "eval",
    description: "Tester un script",
    options: [
        {
            name: "script",
            description: "le script",
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ]
})
export default class Eval implements CommandExecutor {
    async execute(client: ExtendsClient, ctx: InteractionCommandContext) {
        const script = ctx.getOption("script").value.toString();
        const evalEmbed = new EmbedBuilder().setFooter({ text: ctx.getUser.username, iconURL: ctx.getUser.displayAvatarURL() });
        let description = `    
\`\`\`js
${script}
\`\`\`\n
__Return :__
        `
        try {
            let evaled = eval(script);
            evalEmbed.setDescription(description + `
\`\`\`js
${evaled}
\`\`\`
            `)
            ctx.reply({ embeds: [evalEmbed] })
        } catch (err) {
            evalEmbed.setDescription(description+`
\`\`\`xl
${err}
\`\`\`
            `)
            ctx.reply({embeds: [evalEmbed]})
        }
    }
}