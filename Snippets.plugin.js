/**
 * @name Snippets
 * @author Mercenary (mercenaryusa)
 * @description Allows you to create snippets of text that can be inserted into the chatbox by typing a macro.
 * @version 0.0.1
 */

const settings = BdApi.Data.load("Snippets", "settings");

const config = {
    info: {
        name: "Snippets",
        authors: [
            {
                name: "Mercenary (mercenaryusa)",
                discord_id: "188477001990930432",
                github_username: "mercenaryusa"
            }
        ],
        version: "1.0.0",
        description: "Allows you to create snippets of text that can be inserted into the chatbox by typing a shorthand version."
    }
}

if (!global.ZeresPluginLibrary) {
    BdApi.showConfirmationModal("Library Missing", `The library plugin needed for ${config.name ?? config.info.name} is missing. Please click Download Now to install it.`, {
        confirmText: "Download Now",
        cancelText: "Cancel",
        onConfirm: () => {
            require("request").get("https://betterdiscord.app/gh-redirect?id=9", async (err, resp, body) => {
                if (err) return require("electron").shell.openExternal("https://betterdiscord.app/Download?id=9");
                if (resp.statusCode === 302) {
                    require("request").get(resp.headers.location, async (error, response, content) => {
                        if (error) return require("electron").shell.openExternal("https://betterdiscord.app/Download?id=9");
                        await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), content, r));
                    });
                }
                else {
                    await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
                }
            });
        }
    });
}

class Default {
    constructor() { this._config = config; }
    start() { }
    stop() { }
}

function appendMacro(key, value) {
    const macro = Object.assign(document.createElement('div'), { className: `macro-key-${key}` });
    const label = Object.assign(document.createElement('span'), { textContent: `Key: ${key}`, style: 'margin: 5px 0px 5px 5px; display: block' });
    const input = Object.assign(document.createElement('input'), { type: 'text', name: 'macroKey', style: 'margin-left: 5px; width: 300px;', value });
    const button = Object.assign(document.createElement('button'), { textContent: 'Remove', style: 'margin-left: 5px;' });
    button.addEventListener('click', () => {
        delete settings[key];
        BdApi.Data.save("Snippets", "settings", settings);
        macro.remove();
    });
    input.addEventListener('change', () => {
        settings[key] = input.value;
        BdApi.Data.save("Snippets", "settings", settings);
    });
    macro.append(label, input, button);
    return macro;
}

module.exports = !global.ZeresPluginLibrary ? Default : (([Plugin, Api]) => {
    const plugin = (Plugin, Api) => {
        const { Patcher } = window.BdApi;
        const { DiscordSelectors, DiscordModules } = Api;

        return class Snippets extends Plugin {
            constructor() {
                super();
            }

            async onStart() {
                Patcher.before(this.name, DiscordModules.MessageActions, "sendMessage", (_, [, msg]) => {
                    for(const key in settings) {
                        if(msg.content === key) {
                            msg.content = msg.content.replace(key, settings[key]);
                        }
                    }
                });
            }

            onStop() {
                Patcher.unpatchAll(this.name);
            }

            observer(e) {
                if (!e.addedNodes.length || !(e.addedNodes[0] instanceof Element)) return;

                let textarea = document.querySelector(DiscordSelectors.Textarea.textArea);
                let textbox = textarea.querySelector('[data-slate-string="true"]:last-of-type');

                for(const key in settings) {
                    if(textbox.innerHTML === key) {
                        textbox.innerHTML = textbox.innerHTML.replace(key, settings[key]);
                    }
                }
            }

            getSettingsPanel() {
                const panel = document.createElement('div');
                panel.id = 'snippet-settings';

                const macroKeys = document.createElement('div');
                macroKeys.classList.add('macro-keys');

                const newMacroKey = document.createElement('div');
                newMacroKey.classList.add('new-macro');

                const newMacroKeyLabel = document.createElement('span');
                newMacroKeyLabel.textContent = 'Key:';

                const newMacroKeyInput = document.createElement('input');
                newMacroKeyInput.type = 'text';
                newMacroKeyInput.name = 'macroKey';
                newMacroKeyInput.style.width = '100%';
                newMacroKeyInput.style = 'margin-left: 5px;';

                newMacroKey.append(newMacroKeyLabel, newMacroKeyInput);

                const newMacroValue = document.createElement('div');
                newMacroValue.classList.add('new-macro');

                const newMacroValueLabel = document.createElement('span');
                newMacroValueLabel.textContent = 'Value:';

                const newMacroValueInput = document.createElement('input');
                newMacroValueInput.type = 'text';
                newMacroValueInput.name = 'macroKey';
                newMacroValueInput.style = 'margin-left: 5px; width: 300px;';

                const newMacroButton = document.createElement('button');
                newMacroButton.textContent = 'Add Snippet';
                newMacroButton.style = 'margin-left: 5px;';
                newMacroButton.addEventListener('click', () => {
                    settings[newMacroKeyInput.value] = newMacroValueInput.value;
                    BdApi.Data.save("Snippets", "settings", settings);

                    let newMacroItem = appendMacro(newMacroKeyInput.value, newMacroValueInput.value);
                    macroKeys.append(newMacroItem);
                });

                const newMacroDivider = document.createElement('hr');

                const macroListHeader = document.createElement('label');
                macroListHeader.style = 'margin-left: 5px; margin-bottom: 10px; font-size: 20px; font-weight: bold;';
                macroListHeader.textContent = '--- Snippets ---';

                newMacroValue.append(newMacroValueLabel, newMacroValueInput, newMacroButton, newMacroDivider, macroListHeader);

                for(const setting in settings) {

                    let newMacroItem = appendMacro(setting, settings[setting]);
                    macroKeys.append(newMacroItem);
                }

                panel.append(newMacroKey, newMacroValue, macroKeys);
                return panel;
            }
        }
    };
    return plugin(Plugin, Api);
})(global.ZeresPluginLibrary.buildPlugin(config));