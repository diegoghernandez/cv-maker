import { App, Modal, Setting } from "obsidian";

export class BaseCVModal extends Modal {
   constructor(app: App, onSubmit: (result: string) => void) {
      super(app);
      this.setTitle("Add your unformatted CV");

      let cv = "";
      new Setting(this.contentEl)
         .setName("CV")
         .setClass("cv__container")
         .addTextArea((textArea) => textArea.onChange((value) => (cv = value)));

      new Setting(this.contentEl).addButton((btn) =>
         btn
            .setButtonText("Submit")
            .setCta()
            .onClick(() => {
               this.close();
               onSubmit(cv);
            }),
      );
   }
}
