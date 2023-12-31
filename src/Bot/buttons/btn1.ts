import { _Button } from "../../Annotations/_Buttons";
import ExtendsClient from "../../Class/ExtendsClient";
import {ButtonExecutor} from "../../Executor/ButtonExecutor";
import {
    ButtonInteraction
} from "discord.js"

@_Button({
    buttonId: "btn1"
})
export default class Btn1 implements ButtonExecutor {
    execute(client: ExtendsClient, interaction: ButtonInteraction): void {
        interaction.reply({
            content: "Btn clicked !"
        })
    }
}