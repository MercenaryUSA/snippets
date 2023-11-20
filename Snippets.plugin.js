/**
 * @name Snippets
 * @author Mercenary (mercenaryusa)
 * @authorId 188477001990930432
 * @invite betterrl
 * @description Allows you to create snippets of text that can be inserted into the chatbox by typing a shorthand version.
 * @version 1.1.0
 * @website https://github.com/MercenaryUSA/snippets
 * @source https://github.com/MercenaryUSA/snippets/blob/main/Snippets.plugin.js
 * @updateUrl https://github.com/MercenaryUSA/snippets/blob/main/Snippets.plugin.js
 */

const settings = BdApi.Data.load("Snippets", "settings") || {};
const configuration = BdApi.Data.load("Snippets", "configuration") || { caseSensitive: true, showToasts: true };
const versionInfo = BdApi.Data.load("Snippets", "currentVersionInfo") || {};

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
        version: "1.1.0",
        description: "Allows you to create snippets of text that can be inserted into the chatbox by typing a shorthand version.",
        github: "https://github.com/MercenaryUSA/snippets",
        github_raw: "https://raw.githubusercontent.com/MercenaryUSA/snippets/main/Snippets.plugin.js"
    },
    lastUpdate: "11/19/2023 (MM/DD/YYYY)"
}

const changeLog = [
    {
        type: 'added',
        items: [
            'Added a configuration option to make keys case sensitive.',
            'Added a configuration option to show toasts when a snippet is changed.'
        ]
    },
    {
        type: 'changed',
        items: [
            'Styling of the settings panel has been improved.'
        ]
    }
]

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
    const input = Object.assign(document.createElement('input'), { type: 'text', name: 'snippetKey', style: 'margin-left: 5px; margin-bottom: 10px; width: 510px; border: none !important; border-radius: 3px; background-color: #d1d1d1;', value });
    const button = Object.assign(document.createElement('button'), { textContent: 'X', style: 'margin-left: 5px; border-radius: 2px; background-color: #d12600; color: white;' });
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

function showChangelog() {
    if (versionInfo.version == config.info.version) return;

    const panel = document.createElement("div");
    panel.style = "width: 100%; height: 100%; overflow-y: auto;";

    const added = document.createElement("div");
    added.style = "margin-bottom: 20px;";
    const addedTitle = document.createElement("h2");
    addedTitle.textContent = "ADDED";
    addedTitle.style = "margin-bottom: 10px; color: green; font-weight: bold;";
    added.append(addedTitle);
    const addedList = document.createElement("ul");
    added.append(addedList);

    const changed = document.createElement("div");
    changed.style = "margin-bottom: 20px;";
    const changedTitle = document.createElement("h2");
    changedTitle.textContent = "CHANGED";
    changedTitle.style = "margin-bottom: 10px; color: yellow; font-weight: bold;";
    changed.append(changedTitle);
    const changedList = document.createElement("ul");
    changed.append(changedList);

    const fixed = document.createElement("div");
    fixed.style = "margin-bottom: 20px;";
    const fixedTitle = document.createElement("h2");
    fixedTitle.textContent = "FIXED";
    fixedTitle.style = "margin-bottom: 10px; color: orange; font-weight: bold;";
    fixed.append(fixedTitle);
    const fixedList = document.createElement("ul");
    fixed.append(fixedList);

    const removed = document.createElement("div");
    removed.style = "margin-bottom: 20px;";
    const removedTitle = document.createElement("h2");
    removedTitle.textContent = "REMOVED";
    removedTitle.style = "margin-bottom: 10px; color: red; font-weight: bold;";
    removed.append(removedTitle);
    const removedList = document.createElement("ul");
    removed.append(removedList);

    for (const change of changeLog) {
        //this.BdApi.UI.showToast(change.type);
        switch (change.type) {
            case 'added':
                for (const item of change.items) {
                    const li = document.createElement("li");
                    li.textContent = `- ${item}`;
                    li.style = "margin-bottom: 8px; color: lightgrey;";
                    addedList.append(li);
                }
                panel.append(added);
                break;
            case 'changed':
                for (const item of change.items) {
                    const li = document.createElement("li");
                    li.textContent = `- ${item}`;
                    li.style = "margin-bottom: 8px; color: lightgrey;";
                    changedList.append(li);
                }
                panel.append(changed);
                break;
            case 'fixed':
                for (const item of change.items) {
                    const li = document.createElement("li");
                    li.textContent = `- ${item}`;
                    li.style = "margin-bottom: 8px; color: lightgrey;";
                    fixedList.append(li);
                }
                panel.append(fixed);
                break;
            case 'removed':
                for (const item of change.items) {
                    const li = document.createElement("li");
                    li.textContent = `- ${item}`;
                    li.style = "margin-bottom: 8px; color: lightgrey;";
                    removedList.append(li);
                }
                panel.append(removed);
                break;
        }
    }

    const versionLabel = document.createElement("span");
    versionLabel.style = "font-size: 10px; color: grey;";
    versionLabel.textContent = `Version: ${config.info.version}`;
    panel.append(versionLabel);

    const divider = document.createElement("br");
    panel.append(divider);

    const lastUpdateLabel = document.createElement("span");
    lastUpdateLabel.style = "font-size: 10px; color: grey;";
    lastUpdateLabel.textContent = `Updated On: ${config.lastUpdate}`;
    panel.append(lastUpdateLabel);

    this.BdApi.UI.showConfirmationModal(`${config.info.name} Changelog`, this.BdApi.React.createElement(this.BdApi.ReactUtils.wrapElement(panel)), {
        confirmText: "Close",
        cancelText: null,
        onConfirm: () => {
            versionInfo.version = config.info.version;
            BdApi.Data.save("Snippets", "currentVersionInfo", versionInfo);
        }
    });
}

module.exports = !global.ZeresPluginLibrary ? Default : (([Plugin, Api]) => {
    const plugin = (Plugin, Api) => {
        const { UI, Patcher } = window.BdApi;
        const { DiscordModules, PluginUpdater } = Api;

        return class Snippets extends Plugin {
            constructor() {
                super();
                PluginUpdater.checkForUpdate(config.info.name, config.info.version, config.info.github_raw);
                changeLog.length > 0 ? showChangelog() : _;
            }

            async onStart() {
                Patcher.before(this.name, DiscordModules.MessageActions, "sendMessage", (_, [, msg]) => {
                    for (const key in settings) {
                        if (configuration?.caseSensitive ? msg.content.includes(key) : msg.content.toLowerCase().includes(key.toLowerCase())) {
                            if (new RegExp(`\\b${configuration?.caseSensitive ? key : key.toLowerCase()}\\b`).test(configuration?.caseSensitive ? msg.content : msg.content.toLowerCase())) {
                                msg.content = configuration?.caseSensitive ? msg.content.replaceAll(key, settings[key]) : msg.content.toLowerCase().replaceAll(key.toLowerCase(), settings[key]);
                                if (configuration?.showToasts) {
                                    UI.showToast(`Key '${configuration?.caseSensitive ? key : key.toLowerCase()}' changed to '${settings[key]}'`, {
                                        type: "info",
                                        timeout: 3000
                                    });
                                }
                            }
                        }
                    }
                });
            }

            onStop() {
                Patcher.unpatchAll(this.name);
            }

            getSettingsPanel() {
                // --- CREATE A NEW SNIPPET ---

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
                newSnippetKeyInput.style = 'margin-left: 17px; border: none !important; border-radius: 3px; background-color: #d1d1d1';

                newSnippetKey.style = 'margin-bottom: 5px;';

                newSnippetKey.append(newSnippetKeyLabel, newSnippetKeyInput);

                const newSnippetValue = document.createElement('div');
                newSnippetValue.classList.add('new-snippet');

                const newSnippetValueLabel = document.createElement('span');
                newSnippetValueLabel.textContent = 'Value:';

                const newSnippetValueInput = document.createElement('input');
                newSnippetValueInput.type = 'text';
                newSnippetValueInput.name = 'snippetKey';
                newSnippetValueInput.style = 'margin-left: 5px; width: 410px; border: none !important; border-radius: 3px; background-color: #d1d1d1';

                const newSnippetButton = document.createElement('button');
                newSnippetButton.textContent = 'Add Snippet';
                newSnippetButton.style = 'margin-left: 5px; border-radius: 2px; background-color: #5F70AF; color: white;';
                newSnippetButton.addEventListener('click', () => {
                    settings[newSnippetKeyInput.value] = newSnippetValueInput.value;
                    BdApi.Data.save("Snippets", "settings", settings);

                    let newSnippetItem = appendSnippet(newSnippetKeyInput.value, newSnippetValueInput.value);
                    snippetKeys.append(newSnippetItem);

                    newSnippetKeyInput.value = '';
                    newSnippetValueInput.value = '';
                });

                const newSnippetDivider = document.createElement('hr');

                // --- APPEND SNIPPETS TO SETTINGS PANEL ---

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

                // --- CONFIGURATION SECTION ---

                const configurationSection = document.createElement('div');
                configurationSection.style = 'margin-top: 30px; padding-top: 10px; border-top: 1px solid black;';
                configurationSection.id = 'configuration-section';

                const configurationHeader = document.createElement('div');
                configurationHeader.style = 'margin-left: 185px; margin-bottom: 10px; font-size: 20px; font-weight: bold;';
                configurationHeader.textContent = '--- Configuration ---';

                // Make keys case sensitive

                const checkboxContainer = document.createElement('div');
                checkboxContainer.style = 'margin-left: 5px; margin-top: 10px;';
                checkboxContainer.id = 'checkbox-container';

                const caseSensitiveCheckbox = document.createElement('input');
                caseSensitiveCheckbox.id = "case-sensitive";
                caseSensitiveCheckbox.type = 'checkbox';
                caseSensitiveCheckbox.name = 'caseSensitive';
                caseSensitiveCheckbox.style = 'height: 15px; width: 15px; margin-left: 5px;';
                caseSensitiveCheckbox.checked = configuration?.caseSensitive;
                caseSensitiveCheckbox.addEventListener('change', () => {
                    configuration.caseSensitive = caseSensitiveCheckbox.checked;
                    BdApi.Data.save("Snippets", "configuration", configuration);
                });
                checkboxContainer.append(caseSensitiveCheckbox);

                const caseSensitiveLabel = document.createElement('label');
                caseSensitiveLabel.htmlFor = "case-sensitive";
                caseSensitiveLabel.style = 'margin-left: 5px; font-size: 20px;';
                caseSensitiveLabel.textContent = 'Make keys case sensitive';
                checkboxContainer.append(caseSensitiveLabel);

                // ---------------------------

                // Show toasts

                const toastsContainer = document.createElement('div');
                toastsContainer.style = 'margin-left: 5px; margin-top: 10px;';
                toastsContainer.id = 'toasts-container';

                const toastsCheckbox = document.createElement('input');
                toastsCheckbox.id = "toasts";
                toastsCheckbox.type = 'checkbox';
                toastsCheckbox.name = 'toasts';
                toastsCheckbox.style = 'height: 15px; width: 15px; margin-left: 5px;';
                toastsCheckbox.checked = configuration?.showToasts;
                toastsCheckbox.addEventListener('change', () => {
                    configuration.showToasts = toastsCheckbox.checked;
                    BdApi.Data.save("Snippets", "configuration", configuration);
                });
                toastsContainer.append(toastsCheckbox);

                const toastsLabel = document.createElement('label');
                toastsLabel.htmlFor = "toasts";
                toastsLabel.style = 'margin-left: 5px; font-size: 20px;';
                toastsLabel.textContent = 'Show toasts';
                toastsContainer.append(toastsLabel);

                const toastsSubLabel = document.createElement('label');
                toastsSubLabel.htmlFor = "toasts";
                toastsSubLabel.style = 'margin-left: 5px; font-size: 15px; color: whitesmoke; border-radius: 5px; background-color: #B95A0A; padding: 0px 3px 0px 3px;';
                toastsSubLabel.textContent = 'Requires BetterDiscord toasts to be enabled';
                toastsContainer.append(toastsSubLabel);

                // ---------------------------

                configurationSection.append(configurationHeader, checkboxContainer, toastsContainer);

                // --- INFO SECTION ---

                const infoSection = document.createElement('div');
                infoSection.style = 'margin-top: 10px; padding-top: 10px; border-top: 1px solid black;';
                infoSection.id = 'info-section';

                const helperLabel = document.createElement('div');
                helperLabel.style = 'font-style: italic; margin: 5px 0px 10px 5px; color: #72767d;';
                helperLabel.textContent = 'You can edit the values of any snippet and it automatically saves.';
                infoSection.append(helperLabel);

                const orderLabel = document.createElement('div');
                orderLabel.style = 'font-style: italic; margin: 5px 0px 10px 5px; color: #72767d;';
                orderLabel.textContent = 'Snippets are executed in the order they are listed.';
                infoSection.append(orderLabel);

                const discordServer = document.createElement('a');
                discordServer.href = 'https://discord.gg/betterrl';
                discordServer.target = '_blank';
                discordServer.style = 'margin-left: 5px; margin-top: 20px; color: #7289da; display: block;';
                discordServer.textContent = 'Join my Discord server';
                infoSection.append(discordServer);

                panel.append(newSnippetKey, newSnippetValue, snippetKeys, configurationSection, infoSection);
                return panel;
            }
        }
    };
    return plugin(Plugin, Api);
})(global.ZeresPluginLibrary.buildPlugin(config));