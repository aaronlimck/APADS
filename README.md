# Digitalizing Performance Appraisals: A Capstone Project

## Introduction

In an era where digital transformation is revolutionizing processes, our client recognizes the need to evolve and streamline traditional manual practices. The current method of conducting appraisals is not only labor-intensive but also susceptible to errors arising from illegible handwriting and manual data handling.

## The Challenge

Our client has been conducting appraisals manually, relying on handwritten feedback forms and time-consuming data entry processes. This not only hampers efficiency but also introduces the risk of errors, making it challenging to extract meaningful insights from the feedback provided.

## The Solution

To overcome the challenges posed by manual appraisal processes, our capstone project introduces a comprehensive digital solution. Leveraging modern technologies and best practices, we aim to create a robust digital platform that automates and streamlines appraisal workflows.

### Value Addition: Generative AI for Appraisal Forms

As a unique value proposition, our platform incorporates generative AI to dynamically create appraisal forms. This feature allows users to choose from different creation methods:

- **Builder:** Users can construct customized appraisal forms using an intuitive form builder, tailoring questions to specific needs.
- **Template:** Pre-designed templates provide a quick starting point, ensuring consistency and efficiency in the appraisal creation process.
- **Prompt:** For a more AI-driven approach, users can utilize prompts to generate appraisal forms, leveraging the power of generative AI to suggest relevant questions based on predefined criteria.

### Benefits

- **Efficiency:** Automation reduces manual workload and accelerates the appraisal process.
- **Accuracy:** The generative AI ensures clarity and coherence in appraisal forms, mitigating errors caused by manual input.
- **Flexibility:** Users can choose their preferred method of creating appraisals, offering a tailored experience.
- **Innovation:** By incorporating generative AI, our platform introduces a cutting-edge element to the appraisal creation process, aligning with the latest advancements in technology.

In conclusion, our digital solution not only addresses the existing challenges but also goes beyond by introducing innovative features that significantly enhance the appraisal experience for our client. We envision a future where educators and administrators can effortlessly create, manage, and analyze appraisals with unprecedented efficiency and accuracy.

## Features

- **Automation:**
  - Streamline processes and workflows through automation, reducing manual efforts.
- **Template Generation:**
  - Generate customizable templates for appraisals, providing consistency and efficiency.
- **Real-time Analytics:**
  - Access and analyze appraisal data in real-time, enabling quick decision-making and insights.
- **Sentiment Analysis for Open Questions:**
  - Utilize sentiment analysis for open-ended questions to understand the emotional tone and feedback sentiment.

## Technical Stack

### Frontend

- **Language:** TypeScript
- **Framework:** Next.js
- **Authentication:** NextAuth.js

### Backend

- **ORM:** Prisma
- **Database:** PostgresSQL
- **Library** NLKT (Sentiment Analysis)
- **Language:** TypeScript, Python
-

### Additional Service

- **OpenAI API:** GPT-3.5 Turbo
- **Email Service:** Google SMTP

## Installation Guide

### Main Application

To set up and run the frontend application, follow the steps below:

1. **Navigate to the application folder**  
   Open a terminal and use the following command to change directories to the application folder:

   ```shell
   cd application
   ```

2. **Configure environment variables**  
   Replace all the values in the `.env.example` file with the appropriate values for your setup and then rename the file to `.env`:

3. **Install dependencies**  
   Install the necessary dependencies for the frontend application using the following command:

   ```shell
   npm install
   ```

4. **Initialize local database**  
   Start the local database using Docker Compose. Make sure you have Docker installed and running on your system:

   ```shell
   docker compose up
   ```

5. **Initialize Prisma**  
   Generate Prisma client code with the following command:

   ```shell
   npx prisma generate
   ```

6. **Set up Prisma database schema**  
   Push the Prisma schema to your local database. Make sure the local database is running before executing this command:

   ```shell
   npx prisma db push
   ```

7. **Run the frontend application (Default port: 3000)**  
   Finally, start the frontend application using the development server:
   ```shell
   npm run dev
   ```

After successfully running these commands, the frontend application should be accessible at [http://localhost:30000](http://localhost:3000)

### NLTK Model (Sentiment Analysis)

To set up and run the NLTK Model for Sentiment Analysis, follow the steps below:

1. **Navigate to the `nltk_model` folder**  
   Open a terminal and use the following command to change directories to the `nltk_model` folder:

   ```shell
   cd nltk_model
   ```

2. **Install dependencies**  
   Install the necessary dependencies for the model using the following command:

   ```shell
   pip install -r requirements.txt
   ```

3. **Run the model (Default port: 5000)**  
   Start the model using the following command:
   ```shell
   python app.py
   ```

Once the model is running, it should be available on the default port: `5000`. Enjoy using the NLTK Model for Sentiment Analysis!
