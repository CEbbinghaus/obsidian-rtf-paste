import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

// Remember to rename these classes and interfaces!

interface MyPluginSettings {

}

const DEFAULT_SETTINGS: MyPluginSettings = {

}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'paste', (evt: ClipboardEvent) => {
			var types = evt.clipboardData.types;
			if(types.indexOf("text/rtf") == -1)
				return;
	
			let paste = (evt.clipboardData || window.clipboardData).getData('text/rtf');
			var match = /{\\field{\\\*\\fldinst\s*(?:{|)HYPERLINK\s+"(?<Target>.+)"(?:}|)}{\\fldrslt\s*(?:{|)(?:\\\w+)*\s*(?<Name>[^}]+)(?:}|)}}/m.exec(paste)
			if(match == null)
			  return;
			var elements = match.groups
			document.getElementById('target').innerHTML = `[${elements.Name}](${elements.Target})`
			const selection = window.getSelection();
			if (!selection.rangeCount) return;
			selection.deleteFromDocument();
			selection.getRangeAt(0).insertNode(document.createTextNode(paste));
		});
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
