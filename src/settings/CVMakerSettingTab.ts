import { App, PluginSettingTab, Setting } from "obsidian";
import CVMaker from "src/main";

export class CVMakerSettingTab extends PluginSettingTab {
   plugin: CVMaker

   constructor(app: App, plugin: CVMaker) {
      super(app, plugin);
      this.plugin = plugin;
   }

   display(): void {
      let { containerEl } = this;

      containerEl.empty();

      new Setting(containerEl)
         .setName('API Url')
         .setDesc('API compatible with Open AI API')
         .addText((text) =>
            text
               .setValue(this.plugin.settings.baseUrl)
               .onChange(async (value) => {
                  this.plugin.settings.baseUrl = value;
                  await this.plugin.saveSettings();
               })
         );

      new Setting(containerEl)
         .setName('Model')

         .addText((text) =>
            text
               .setValue(this.plugin.settings.model)
               .setPlaceholder('model-2.321-pro-preview')
               .onChange(async (value) => {
                  this.plugin.settings.model = value;
                  await this.plugin.saveSettings();
               })
         );

      new Setting(containerEl)
         .setName('API key')
         .addText((text) =>
            text
               .setValue(this.plugin.settings?.apiKey ?? '')
               .setPlaceholder('vfdsf231********************')
               .onChange(async (value) => {
                  this.plugin.settings.apiKey = value;
                  await this.plugin.saveSettings();
               })
         );
   }
}
