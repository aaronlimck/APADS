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
    const res = await fetch(`${process.env.NLTK_API_URL}/getSentiment`, {
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

export async function getClusters(payload: any) {
  try {
    const res = await fetch(`${process.env.NLTK_API_URL}/getClusters`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return res.json();
  } catch (err) {
    console.log(err);
  }
}

export function formattedAIFormDataToForm(rawDataString: any): any {
  const formattedData = JSON.parse(rawDataString);

  const formStructure = formattedData.map((question: any) => {
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
    } else if (question.Type === "TitleField") {
      return {
        id: idGenerator(),
        type: "TitleField",
        extraAttributes: {
          title: question.Title,
          managerOnly: question.User === "Manager" ? true : false,
        },
      };
    }
  });

  return formStructure;
}

export function extractDateInfo(dateString: string): string {
  const date = new Date(dateString);
  const month = date
    .toLocaleString("default", { month: "long" })
    .replace(/^\w/, (c) => c.toUpperCase());
  const day = date.getDate();
  const year = date.getFullYear();

  return `${month} ${day} ${year}`;
}

export function convertToSGTimeString(timestampStr: string): string {
  // Convert string to Date object
  let utcTime: Date = new Date(timestampStr);

  // Define Singapore timezone offset in milliseconds (GMT+8)
  let sgOffset: number = 8 * 60 * 60 * 1000;

  // Convert to Singapore time
  let sgTime: Date = new Date(utcTime.getTime() + sgOffset);

  // Format Singapore time as string
  let sgTimeStr: string = sgTime.toISOString();

  return sgTimeStr;
}

export function convertDateString(inputString: string) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const date = new Date(inputString);
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}
