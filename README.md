# DATA - Detection & Threat Analytics Tracking Application

![DATA Logo](data.webp) 

## Table of Contents - Work in progress!

- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [API Endpoints](#api-endpoints)
- [Frontend Features](#frontend-features)
- [CSV Upload Format](#csv-upload-format)

---

## Project Overview

**DATA - Detection & Threat Analytics Tracking Application** is a comprehensive web application designed to help organizations manage and analyze their security detections effectively. It offers functionalities such as adding, editing, deleting, and viewing detections, bulk uploading detections via CSV files, calculating Shannon Signal Scores, and integrating MITRE ATT&CK framework mappings. The application leverages React for the frontend and Django REST Framework for the backend, ensuring a robust and scalable solution for threat analytics.

This work was based heavily on the [Shannon Signal Score framework](https://medium.com/@dylanhwilliams/what-makes-a-good-detection-dd6a3b373860) by [Dylan](https://medium.com/@dylanhwilliams)

---

## Features

- **Add, Edit, Delete, View Detections:** Manage security detections with ease through a user-friendly interface.
- **Bulk Upload via CSV:** Efficiently add multiple detections at once using a CSV file.
- **Shannon Signal Score Calculation:** Automatically compute the Shannon Score based on customizable weights.
- **Adjust Shannon Score Weights:** Modify the weights assigned to different components of the Shannon Score.
- **MITRE ATT&CK Framework Integration:** Classify detections according to the MITRE ATT&CK tactics and techniques.
- **Responsive Design:** Accessible on various devices with a clean and intuitive UI built with Material-UI.
- **Confirmation Dialogs:** Prevent accidental deletions with confirmation prompts.
- **User Feedback:** Receive real-time notifications on actions like uploads and deletions.

---

## Technologies Used

### Frontend

- **React:** A JavaScript library for building user interfaces.
- **Material-UI:** React components for faster and easier web development.
- **Axios:** Promise-based HTTP client for the browser and Node.js.
- **React Router:** Declarative routing for React applications.

### Backend

- **Django:** A high-level Python web framework.
- **Django REST Framework:** A powerful and flexible toolkit for building Web APIs.
- **PostgreSQL:** An advanced open-source relational database.
- **OpenAI API:** Leveraging OpenAI for natural language processing tasks.

---

## Getting Started

Follow these instructions to set up and run the project locally on your machine.

### Prerequisites

- **Node.js & npm:** [Download and install](https://nodejs.org/)
- **Python 3.8+**
- **pip:** Python package manager
- **PostgreSQL:** [Download and install](https://www.postgresql.org/download/)
- **Git:** [Download and install](https://git-scm.com/downloads)

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/DATA.git
cd DATA