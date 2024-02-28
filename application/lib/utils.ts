import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertTextToTitleCase(text: string) {
  const words = text.split(" ");
  const capitalizedWords = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
  return capitalizedWords.join(" ");
}

export function idGenerator(): string {
  return Math.floor(Math.random() * 10001).toString();
}

export function generateRandomPassword(length: number): string {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=<>?";
  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset.charAt(randomIndex);
  }
  return password;
}

export function analyzeFormResponses(formStructure: any, formResponses: any) {
  const resultArray: any[] = [];
  formStructure.forEach((question: any) => {
    const questionId = question.id;
    const questionType = question.type;

    if (questionType === "SelectField") {
      const questionAsk = question.extraAttributes.label;
      const options = question.extraAttributes.options;
      // Initialize the counts for each option to 0
      const optionCounts: { [key: string]: number } = {};
      options.forEach((option: string) => {
        optionCounts[option] = 0;
      });

      // Iterate through formResponses and count occurrences for each option
      formResponses.forEach((response: any) => {
        const selectedOption = response[questionId];
        if (
          selectedOption !== undefined &&
          optionCounts.hasOwnProperty(selectedOption)
        ) {
          optionCounts[selectedOption]++;
        }
      });
      // Create the summary object
      const summary = {
        id: questionId,
        type: questionType,
        question: questionAsk,
        data: optionCounts,
      };
      // Add the summary object to the result array
      resultArray.push(summary);
    } else if (questionType === "TextAreaField") {
      const questionAsk = question.extraAttributes.label;
      let questionResponses: string[] = [];
      // Iterate through formResponses and count occurrences for each option
      formResponses.forEach((response: any) => {
        const responseText = response[questionId];
        questionResponses.push(responseText);
      });
      // Create the summary object
      const summary = {
        id: questionId,
        type: questionType,
        question: questionAsk,
        data: questionResponses,
      };
      // Add the summary object to the result array
      resultArray.push(summary);
    }
  });
  return resultArray;
}

export async function getSentiment(payload: any) {
  try {
    const res = await fetch(`http://127.0.0.1:5000/getSentiment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const responseSentiment = await res.json();
    return responseSentiment;
  } catch (err) {
    console.log(err);
  }
}

export function transformGeneratedAITemplateToForm(
  generatedAITemplate: any,
): any {
  const data = JSON.parse(generatedAITemplate);

  const formStructure = data.Questions.map((question: any) => {
    if (question.Type === "Close") {
      return {
        id: idGenerator(),
        type: "SelectField",
        extraAttributes: {
          label: question.Question,
          placeHolder: "Select an option",
          required: false,
          options: question.Options,
          managerOnly: question.User === "Manager" ? true : false,
        },
      };
    } else if (question.Type === "Open") {
      return {
        id: idGenerator(),
        type: "TextAreaField",
        extraAttributes: {
          label: question.Question,
          placeHolder: "Value here...",
          required: false,
          rows: 3,
          managerOnly: question.User === "Manager" ? true : false,
        },
      };
    }
  });

  return formStructure;
}
