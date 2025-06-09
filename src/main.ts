import { Notice, Plugin, TFolder } from 'obsidian';
import { BaseCVModal } from './modals/BaseCVModal';
import { JobDescriptionModal } from './modals/JobDescriptionModal';
import { createCV } from './services/createNewCV';
import { extractAndFormat } from './services/extractAndFormat';
import { CVMakerSettings } from './types';
import { CVMakerSettingTab } from './settings/CVMakerSettingTab';

const DEFAULT_SETTINGS: CVMakerSettings = {
    baseUrl: '',
    model: 'llama.cpp'
}

const NOTICE_DURATION = 3500
const BASE_CV_PATH = 'cvs/__base__.md'

export default class CVMaker extends Plugin {
    settings: CVMakerSettings;

    async onload() {
        await this.loadSettings();
        this.addSettingTab(new CVMakerSettingTab(this.app, this))

        // This creates an icon in the left ribbon.
        this.addRibbonIcon('newspaper', 'Create a new cv', async () => {
            const { vault } = this.app

            if (!(vault.getAbstractFileByPath('cvs') instanceof TFolder)) {
                new Notice("cvs directory doesn't exist, It will be created in a moment", NOTICE_DURATION)
                await vault.createFolder('cvs')
                new Notice('cvs directory created', NOTICE_DURATION + 1000)
            }

            if (!vault.getFileByPath(BASE_CV_PATH)) {
                new Notice("__base__ cv doesn't exist")
                new BaseCVModal(this.app, (resume) => {
                    new Notice('CV information send to llm to be extracted')

                    extractAndFormat({ resume, settings: this.settings }).then(async ([_, result]) => {
                        await vault.create(BASE_CV_PATH, result)
                        new Notice('CV information extracted, located at ' + BASE_CV_PATH.replace('.md', ''))
                    })
                }).open()

                return
            }

            if (vault.getFileByPath(BASE_CV_PATH)) {
                new JobDescriptionModal(this.app, async ({ companyName, jobDescription }) => {
                    new Notice('Resume and job description send to process for llm...', NOTICE_DURATION)

                    const [error, result] = await createCV({
                        cvPrompt: {
                            resume: await vault.cachedRead(vault.getFileByPath(BASE_CV_PATH)),
                            jobDescription
                        },
                        settings: this.settings
                    })

                    if (error) {
                        new Notice(error + ': ' + result, NOTICE_DURATION + 2000)
                        return
                    }

                    const cvPath = companyName + '.md'
                    await vault.create('cvs/' + cvPath, result)
                    new Notice('CV adapted at: cvs/' + cvPath)
                }).open()
            }
        });
    }

    onunload() { }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}
