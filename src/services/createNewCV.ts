import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { generateText } from "ai";
import { setEngine } from "crypto";
import { CVMakerSettings } from "src/types";

type Prompt = {
   resume: string,
   jobDescription: string
}

const prompt = ({ resume, jobDescription }: Prompt) => `
[RESUME]=${resume}
[JOB_DESCRIPTION]=${jobDescription}
~

Step 1: Analyze the following job description and list the key skills, experiences, and qualifications required for the role in bullet points.

Job Description:[JOB_DESCRIPTION]

~

Step 2: Review the following resume and list the skills, experiences, and qualifications it currently highlights in bullet points.

Resume:[RESUME]

~

Step 3: Compare the lists from Step 1 and Step 2. Identify gaps where the resume does not address the job requirements.
Suggest specific additions or modifications to better align the resume with the job description.

~

Step 4: Using the suggestions from Step 3, rewrite the resume to create an updated version tailored to the job description,
Ensure the updated resume emphasizes the relevant skills, experiences, and qualifications required for the role.

~

Step 5: Review the updated resume for clarity, conciseness, and impact. Provide any final recommendations for improvement.
`
/*
where each time that you add data, you should don't delete the original data and surround it with this span tags: <span style="color:red;"></span>
and then the added data at this span tags <span style="color:green;"></span>

Here is an example of how you need to do it:

Original text: Under the golden dawn, possibilities unfurl like petals, each moment a canvas awaiting bold strokes. Embrace the whispers of curiosity,
let courage guide your steps toward uncharted horizons. In every ending lies a seed; nurture it, and watch resilience bloom.

Updated text: Under the golden dawn, <span style="color:red;">possibilities unfurl like petals</span><span style="color:green;">ramifications show upon shiniest</span>, 
each moment a canvas awaiting bold strokes. Embrace the whispers of curiosity, let courage guide your steps toward uncharted horizons. In
<span style="color:red;">every ending lies</span><span style="color:green;">each start prevails</span> a seed; nurture it, and watch resilience bloom.

And here is another example of how you have to do it in case of list:

Original text:
- New first point
- Second old point
- Third point
- Fourth point

Updated text: 
<span style="color:red;">- New first point</span>
- Second <span style="color:red;">old point</span><span style="color:green;">new feature</span>
<span style="color:red;">
- Third point
- Fourth point
</span>

~

Step 5: Compare the resume created in the Step 4, with the following resume that you used to rewrite.
Everytime you identify delete it data from the original resume, put that delete data in the updated resume,
in similar sections to the original one, and encapsulated in this span tags: <span style="color:red;"></span>

Resume:[RESUME]
*/

interface Params {
   cvPrompt: Prompt
   settings: CVMakerSettings
}
export function createCV({ cvPrompt, settings }: Params): Promise<[string | null, string]> {
   const provider = createOpenAICompatible({
      name: 'llama.cpp',
      baseURL: settings.baseUrl,
      apiKey: settings.apiKey
   })

   return generateText({
      model: provider(settings.model),
      prompt: prompt(cvPrompt)
   }).then((value) => [null, value.text] as [null, string])
      .catch((error) => {
         if (error instanceof Error) {
            return [error.message, 'Ensure that the sever of your choose is running correctly']
         }

         return ['Failure with the request', '']
      })
}
