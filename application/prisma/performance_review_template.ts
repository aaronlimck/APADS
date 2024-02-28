export const templateData = [
  {
    id: "5070",
    type: "TitleField",
    extraAttributes: {
      title: "Self-Evaluation Questions",
      managerOnly: false,
    },
  },
  {
    id: "9223",
    type: "SelectField",
    extraAttributes: {
      label:
        "How effectively do you communicate with team members and other departments?",
      placeHolder: "Select an option",
      required: false,
      options: ["Excellent", "Good", "Satisfactory", "Needs Improvement"],
      managerOnly: false,
    },
  },
  {
    id: "8400",
    type: "SelectField",
    extraAttributes: {
      label: "Rate your ability to prioritize tasks and meet deadlines",
      placeHolder: "Select an option",
      required: false,
      options: ["Exceptional", "Competent", "Adequate", "Requires Improvement"],
      managerOnly: false,
    },
  },
  {
    id: "2571",
    type: "SelectField",
    extraAttributes: {
      label:
        "Assess your contribution to team projects and collaboration with colleagues",
      placeHolder: "Select an option",
      required: false,
      options: [
        "Always collaborative",
        "Usually collaborative",
        "Occasionally collaborative",
        "Rarely collaborative",
      ],
      managerOnly: false,
    },
  },
  {
    id: "3033",
    type: "SelectField",
    extraAttributes: {
      label: "How well do you handle changes and adapt to new situations?",
      placeHolder: "Select an option",
      required: false,
      options: ["Very well", "Well", "Somewhat", "Not well"],
      managerOnly: false,
    },
  },
  {
    id: "9771",
    type: "TextAreaField",
    extraAttributes: {
      label:
        "What accomplishments are you most proud of during the review period, and why?",
      placeHolder: "Value here...",
      required: false,
      rows: 3,
      managerOnly: false,
    },
  },
  {
    id: "6311",
    type: "TextAreaField",
    extraAttributes: {
      label: "Describe any challenges you faced and how you overcame them.",
      placeHolder: "Value here...",
      required: false,
      rows: 3,
      managerOnly: false,
    },
  },
  {
    id: "42",
    type: "TitleField",
    extraAttributes: {
      title: "Manager's Evaluation Questions",
      managerOnly: true,
    },
  },
  {
    id: "6391",
    type: "SelectField",
    extraAttributes: {
      label: "Assess the employee's ability to lead and motivate a team",
      placeHolder: "Select an option",
      required: false,
      options: ["Exemplary", "Competent", "Developing", "Unsatisfactory"],
      managerOnly: true,
    },
  },
  {
    id: "5833",
    type: "SelectField",
    extraAttributes: {
      label:
        "How well does the employee understand and apply their job-related skills and knowledge?",
      placeHolder: "Select an option",
      required: false,
      options: ["Exceptional", "Proficient", "Basic", "Insufficient"],
      managerOnly: true,
    },
  },
  {
    id: "9099",
    type: "SelectField",
    extraAttributes: {
      label:
        "Evaluate the employee's proactivity in taking on new responsibilities",
      placeHolder: "Select an option",
      required: false,
      options: [
        "Highly proactive",
        "Proactive",
        "Occasionally proactive",
        "Lacks initiative",
      ],
      managerOnly: true,
    },
  },
  {
    id: "3077",
    type: "SelectField",
    extraAttributes: {
      label: "Rate the overall quality of the employee's work",
      placeHolder: "Select an option",
      required: false,
      options: [
        "Outstanding",
        "Satisfactory",
        "Needs Improvement",
        "Unsatisfactory",
      ],
      managerOnly: true,
    },
  },
];
