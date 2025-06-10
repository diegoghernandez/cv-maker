import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { generateText } from "ai";
import { CVMakerSettings } from "src/types";

const prompt = ({ resume }: { resume: string }) => `
[RESUME]:${resume}

From the [RESUME] that I already passsed you, extract the following data, with this consideratiosn:
- When you find the CONTACT_INFO, include the location of the owner of the CV is in this format: state, country
Data: [USERNAME, JOB_POSITION, CONTACT_INFO, OBJECTIVE, SCHOOL_NAME, SCHOOL_LOCATION,
MAJOR, FINISH_DATE, PROJECT_NAME, START_PROJECT_DATE, END_PROJECT_DATE, PROJECT_POINTS,
SKILL_CATEGORY, RESPECTIVE_SKILLS]

Now with the data already extracted, replace the variables in the following template with the respective data, and
as output, only send the populated template, and in case that you find a url, transform it to their equivalent
in markdown, removing the everything except the domain and top level domain in the link text:

## [NAME]
# [JOB_POSITION]
[CONTACT_INFO][0] · [CONTACT_INFO][1] · [CONTACT_INFO][...]
***
[OBJECTIVE]

**EDUCATION**
***
| **[SCHOOL_NAME]** | [SCHOOL_LOCATION] |
| ------------- | -------------- |
| [MAJOR] | [FINISH_DATE]  |
**PROJECTS**
***
<div style='display:flex; justify-content:space-between; font-weight: bold;'>
<p>[PROJECT_NAME]</p>
<p>[START_PROJECT_DATE]–[END_PROJECT_DATE]</p>
</div>
- [PROJECT_POINTS][0]
- [PROJECT_POINTS][1]
- [PROJECT_POINTS][...]

**SKILLS**
***
- **[SKILL_CATEGORY][0]**: [RESPECTIVE_SKILLS]
- **[SKILL_CATEGORY][1]**: [RESPECTIVE_SKILLS]
- **[SKILL_CATEGORY][...]**: [RESPECTIVE_SKILLS]
`;

interface Params {
   resume: string;
   settings: CVMakerSettings;
}

export function extractAndFormat({
   resume,
   settings,
}: Params): Promise<[string | null, string]> {
   const provider = createOpenAICompatible({
      name: "llama.cpp",
      baseURL: settings.baseUrl,
      apiKey: settings.apiKey,
   });

   return generateText({
      model: provider(settings.model),
      prompt: prompt({ resume }),
   })
      .then((value) => [null, value.text] as [null, string])
      .catch((error) => {
         if (error instanceof Error) {
            return [
               error.message,
               "Ensure that the sever of your choose is running correctly",
            ];
         }

         return ["Request failure", ""];
      });
}
