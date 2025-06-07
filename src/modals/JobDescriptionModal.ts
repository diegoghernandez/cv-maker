import { App, Modal, Setting } from "obsidian";

export class JobDescriptionModal extends Modal {
   constructor(app: App, onSubmit: (result: { companyName: string, jobDescription: string }) => void) {
      super(app)
      this.setTitle('Put the job description')
      let companyName = ''
      let jobDescription = ''

      new Setting(this.contentEl)
         .setName('Company name')
         .setClass('cv__container')
         .addText((text) =>
            text.onChange((value) => companyName = value)
         )

      new Setting(this.contentEl)
         .setName('Job description')
         .setClass('cv__container')
         .addTextArea((textArea) =>
            textArea.onChange((value) => jobDescription = value)
         )

      new Setting(this.contentEl)
         .addButton((btn) =>
            btn.setButtonText('Submit')
               .setCta()
               .onClick(() => {
                  this.close()
                  onSubmit({
                     companyName,
                     jobDescription
                  })
               })
         )
   }
}
