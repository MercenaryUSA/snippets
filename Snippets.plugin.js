/**
 * @name Snippets
 * @author Mercenary (mercenaryusa)
 * @authorId 188477001990930432
 * @invite betterrl
 * @description Allows you to create snippets of text that can be inserted into the chatbox by typing a shorthand version.
 * @version 1.0.0
 * @website https://github.com/MercenaryUSA/snippets
 * @source https://github.com/MercenaryUSA/snippets/blob/main/Snippets.plugin.js
 * @updateUrl https://github.com/MercenaryUSA/snippets/blob/main/Snippets.plugin.js
 */

const settings = BdApi.Data.load("Snippets", "settings") || {};

const config = {
    info: {
        name: "Snippets",
        authors: [
            {
                name: "Mercenary (mercenaryusa)",
                discord_id: "188477001990930432",
                github_username: "MercenaryUSA",
            }
        ],
        version: "1.0.0",
        description: "Allows you to create snippets of text that can be inserted into the chatbox by typing a shorthand version.",
        github: "https://github.com/MercenaryUSA/snippets",
        github_raw: "https://github.com/MercenaryUSA/snippets/blob/main/Snippets.plugin.js"
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

function appendSnippet(key, value) {
    const snippet = Object.assign(document.createElement('div'), { className: `snippet-key-${key}`, style: 'border-bottom: 2px solid white;' });
    const label = Object.assign(document.createElement('span'), { textContent: `Key: ${key}`, style: 'margin: 10px 0px 10px 5px; display: block' });
    const input = Object.assign(document.createElement('input'), { type: 'text', name: 'snippetKey', style: 'margin-left: 5px; margin-bottom: 10px; width: 475px;', value });
    const button = Object.assign(document.createElement('button'), { textContent: 'Remove', style: 'margin-left: 5px;' });
    button.addEventListener('click', () => {
        delete settings[key];
        BdApi.Data.save("Snippets", "settings", settings);
        snippet.remove();
    });
    input.addEventListener('change', () => {
        settings[key] = input.value;
        BdApi.Data.save("Snippets", "settings", settings);
    });
    snippet.append(label, input, button);
    return snippet;
}

module.exports = !global.ZeresPluginLibrary ? Default : (([Plugin, Api]) => {
    const plugin = (Plugin, Api) => {
        const { UI, Patcher } = window.BdApi;
        const { DiscordModules } = Api;

        return class Snippets extends Plugin {
            constructor() {
                super();
            }

            async onStart() {
                Patcher.before(this.name, DiscordModules.MessageActions, "sendMessage", (_, [, msg]) => {
                    for (const key in settings) {
                        if (msg.content.includes(key)) {
                            if (new RegExp(`\\b${key}\\b`).test(msg.content)) {
                                msg.content = msg.content.replaceAll(key, settings[key]);
                                UI.showToast(`Key '${key}' changed to '${settings[key]}'`, {
                                    type: "info",
                                    timeout: 3000
                                });
                            }
                        }
                    }
                });
            }

            onStop() {
                Patcher.unpatchAll(this.name);
            }

            getSettingsPanel() {
                const panel = document.createElement('div');
                panel.id = 'snippet-settings';

                const snippetKeys = document.createElement('div');
                snippetKeys.classList.add('snippet-keys');

                const newSnippetKey = document.createElement('div');
                newSnippetKey.classList.add('new-snippet');

                const newSnippetKeyLabel = document.createElement('span');
                newSnippetKeyLabel.textContent = 'Key:';

                const newSnippetKeyInput = document.createElement('input');
                newSnippetKeyInput.type = 'text';
                newSnippetKeyInput.name = 'snippetKey';
                //newSnippetKeyInput.style.width = '100%';
                newSnippetKeyInput.style = 'margin-left: 17px;';

                newSnippetKey.style = 'margin-bottom: 5px;';

                newSnippetKey.append(newSnippetKeyLabel, newSnippetKeyInput);

                const newSnippetValue = document.createElement('div');
                newSnippetValue.classList.add('new-snippet');

                const newSnippetValueLabel = document.createElement('span');
                newSnippetValueLabel.textContent = 'Value:';

                const newSnippetValueInput = document.createElement('input');
                newSnippetValueInput.type = 'text';
                newSnippetValueInput.name = 'snippetKey';
                newSnippetValueInput.style = 'margin-left: 5px; width: 410px;';

                const newSnippetButton = document.createElement('button');
                newSnippetButton.textContent = 'Add Snippet';
                newSnippetButton.style = 'margin-left: 5px;';
                newSnippetButton.addEventListener('click', () => {
                    settings[newSnippetKeyInput.value] = newSnippetValueInput.value;
                    BdApi.Data.save("Snippets", "settings", settings);

                    let newSnippetItem = appendSnippet(newSnippetKeyInput.value, newSnippetValueInput.value);
                    snippetKeys.append(newSnippetItem);

                    newSnippetKeyInput.value = '';
                    newSnippetValueInput.value = '';
                });

                const newSnippetDivider = document.createElement('hr');

                const snippetListHeader = document.createElement('label');
                snippetListHeader.style = 'margin-left: 200px; margin-bottom: 10px; font-size: 20px; font-weight: bold;';
                snippetListHeader.textContent = '--- Snippets ---';

                newSnippetValue.append(newSnippetValueLabel, newSnippetValueInput, newSnippetButton, newSnippetDivider, snippetListHeader);

                if (Object.keys(settings).length > 0) {
                    for (const setting in settings) {
                        let newSnippetItem = appendSnippet(setting, settings[setting]);
                        snippetKeys.append(newSnippetItem);
                    }
                }

                const infoSection = document.createElement('div');
                infoSection.style = 'margin-top: 30px; padding-top: 10px; border-top: 1px solid black;';
                infoSection.id = 'info-section';

                const helperLabel = document.createElement('label');
                helperLabel.style = 'font-style: italic; margin-left: 5px; color: #72767d;';
                helperLabel.textContent = 'You can edit the values of any snippet and it automatically saves.';
                infoSection.append(helperLabel);

                const discordServer = document.createElement('a');
                discordServer.href = 'https://discord.gg/betterrl';
                discordServer.target = '_blank';
                discordServer.style = 'margin-left: 5px; margin-top: 20px; color: #7289da; display: block;';
                discordServer.textContent = 'Join my Discord server';
                infoSection.append(discordServer);

                panel.append(newSnippetKey, newSnippetValue, snippetKeys, infoSection);
                return panel;
            }
        }
    };
    return plugin(Plugin, Api);
})(global.ZeresPluginLibrary.buildPlugin(config));