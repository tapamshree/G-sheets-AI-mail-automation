# AI-Powered Email Automation using Google Sheets

Send personalized emails automatically — for free, using just Google Sheets and Apps Script.

---

## Overview

This project automates sending custom, personalized emails directly from Google Sheets using Google Apps Script. It eliminates the need for paid email automation tools, manual copy-paste workflows, and complex backend infrastructure. Everything runs inside your Google account, making it lightweight, scalable, and completely free.

---

## Why This Project Stands Out

Most email automation tools require paid subscriptions, complex setup, and store your data on external servers. This solution runs entirely on Google infrastructure using tools you already have, takes less than 10 minutes to set up, and is fully customizable.

---

## Features

- Automated email sending via Gmail
- Dynamic content generation with optional AI integration
- Data-driven personalization using Google Sheets
- Scheduled triggers (e.g., daily at 6 AM)
- Category-based messaging (Student / NGO / Volunteer)
- Easily scalable for bulk email campaigns

---

## How It Works

```
Google Sheet --> Apps Script --> Gmail --> Recipient Inbox
```

1. Store recipient data in a Google Sheet
2. The script reads each row
3. Generates personalized email content
4. Sends the email via Gmail
5. A time-based trigger runs this process automatically each day

---

## Tech Stack

| Layer         | Tool                          |
|---------------|-------------------------------|
| Backend Logic | Google Apps Script            |
| Database      | Google Sheets                 |
| Email Delivery| Gmail Service                 |
| AI (Optional) | Gemini API                    |

---

## Cost

This project is completely free to use.

- No hosting required
- No external servers
- No paid APIs (AI integration is optional)

---

## Setup Guide

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2. Install clasp (Apps Script CLI)

```bash
npm install -g @google/clasp
clasp login
```

### 3. Link Your Apps Script Project

```bash
clasp clone YOUR_SCRIPT_ID
```

### 4. Set Required Script Properties

Inside the Apps Script editor:

- Go to **Project Settings > Script Properties**
- Add the following property (optional, for AI features):

```
GEMINI_API_KEY = your_api_key
```

### 5. Set Up the Google Sheet

Structure your sheet with the following columns:

| Column | Field                   |
|--------|-------------------------|
| A      | Email                   |
| B      | Name                    |
| C      | Category                |
| D      | Topic                   |
| E      | Generated Email Content |

### 6. Add a Trigger

- Open the Apps Script editor
- Go to **Triggers**
- Add a new trigger with the following settings:
  - **Function:** `sendDailyEmails`
  - **Event source:** Time-driven
  - **Type:** Day timer
  - **Time:** 6 AM (or your preferred time)

---

## Security

Sensitive values like API keys are stored using Google's built-in `PropertiesService`, which keeps secrets out of your source code:

```javascript
PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
```

Never hardcode credentials directly in the script.

---

## Screenshots

> Add the following screenshots to help users get started:
> - Google Sheet structure
> - Apps Script editor view
> - Trigger configuration panel

---

## Use Cases

- NGOs sending updates to volunteers and donors
- Colleges communicating with students
- Startups running outreach campaigns
- Daily engagement or newsletter emails
- Personalized marketing at scale

---

## Future Improvements

- Email success/failure logging per recipient
- Retry mechanism for failed sends
- Admin dashboard with stats and analytics
- Support for multiple email templates
- Rate limiting to avoid Gmail quotas

---

## Contributing

Feel free to fork this repository, make improvements, and open a pull request. All contributions are welcome.

---

## Final Note

This project demonstrates that powerful automation does not require expensive tools or complex backend systems — just a smart use of the platforms you already have access to.
