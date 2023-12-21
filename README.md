# Techinno

#                                                                    PsychEdu-Companion

## Introduction
Our project, PsychEdu-Companion, represents an innovative solution that combines the power of AI-driven companionship with personalized education. This project is a testament to our commitment to utilizing GitHub to foster a collaborative, open-source environment that aligns with the platform's goals and benefits from its rich set of development and collaboration features.

## Potential UseCase
**Personalized Education:** PsychEdu-Companion can serve as a powerful educational tool, offering students personalized course outlines and content. GitHub provides an excellent platform for sharing educational resources and fostering a community of learners and educators.

**Open-Source Contribution:** As an open-source project, PsychEdu-Companion invites developers to contribute to its growth. GitHub's collaborative features allow for easy contributions, bug fixes, and feature enhancements.

**AI Research and Development:** Our use of AI, including the Llama-70B model, opens doors for AI enthusiasts to explore and develop AI-driven applications. GitHub acts as a hub for AI research, code sharing, and collaboration.

## Tech Stacks
![REVA HACK 2023 (3)](https://github.com/Naveen3251/Techinno/assets/114800360/be258183-9016-4a19-b513-f671ddea9771)

### Special One
**Mobile Friendly Web Application**

## Features:
Tailwind design<br>
Tailwind animations and effects<br>
Full responsiveness<br>
Clerk Authentication (Email, Google, 9+ Social Logins)<br>
Client form validation and handling using react-hook-form<br>
Server error handling using react-toast<br>
Image Generation Tool (Open AI)<br>
Conversation Generation Tool (Open AI)<br>
Page loading state<br>

### Prerequisites
Node version 18.x.x

### Install packages
npm i<br>
### Setup .env file
```NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

OPENAI_API_KEY=
REPLICATE_API_TOKEN=

PINECONE_API_KEY=
PINECONE_ENVIRONMENT=
PINECONE_INDEX=

UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=

DATABASE_URL=

NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Setup Prisma
Add MySQL Database (I used PlanetScale)

```npx prisma db push
```

### Seed categories:

```node scripts/seed.ts
```

### Start the app

```npm run dev
```

### Cloning the repository

```git clone https://github.com/Naveen3251/Techinno.git
```

### Outputs

### 1] Sigin/SignUp using clerk
![Authentication](https://github.com/Naveen3251/Techinno/assets/114800360/b36e57e9-6a18-441f-a0c9-e85437a0f181)

### 2] Account Management using clerk
![Account Management](https://github.com/Naveen3251/Techinno/assets/114800360/d7bfc92c-b68f-4e74-816f-8bf57831f57c)

### 3] Companions
![HomePage](https://github.com/Naveen3251/Techinno/assets/114800360/31d1853f-7355-4258-9393-79421538fc5d)

### 4] Form for creating your customized companion
![Form](https://github.com/Naveen3251/Techinno/assets/114800360/de277418-5bc6-4231-8e11-0fa7e4256265)

### 5] Chat Page
![Chat](https://github.com/Naveen3251/Techinno/assets/114800360/368d3904-27d2-4a52-92c9-472d94c2d726)

