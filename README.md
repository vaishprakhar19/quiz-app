# Quiz Game

## Overview
This is a quiz game where players answer questions by catching falling options with a basket using arrow keys. The game has a scoring system where players earn points for correct answers and lose points for mistakes. Players can proceed through questions and see their performance at the end, along with answer reviews, detailed solution, study material, and practice set.

## Features
- *Dynamic Quiz*: Questions and options are fetched from an API and displayed in the game.
- *Falling Options*: Answer choices fall towards the basket. The player must catch the correct option.
- *Responsive Controls*: Arrow keys for desktop control the basket.
- *Responsive Design*: Fully Responsive design to be accessible from any device.
- *Scoring System*: Correct answers earn points, and incorrect ones result in a penalty.
- *End Results*: View score and detailed solutions at the end of the game.

---

## Setup and Installation

### Prerequisites
- Node.js installed on your machine (v14 or above).
- A browser (for testing).

### Steps to Run Locally

1. *Clone the repository*
   bash
   git clone https://github.com/your-username/quiz-game.git
   cd quiz-game
   

2. *Install Dependencies*
   Install all the required dependencies using npm or yarn. For both Frontend and Backend
   bash
   cd Frontend
   npm install
   
   or
   bash
   cd Frontend
   yarn install

   bash
   cd Backend
   npm install
   
   or
   bash
   cd Backend
   yarn install
   

4. *Run the App*
   Start the development server.
   bash
   npm start
   
   or
   bash
   yarn start
   

   This will start the app at http://localhost:3000.

5. *Run the Backend*
   Start the backend server.
   bash
   node server.mjs

   This will start the backend server at http://localhost:5000.

---

## Game Controls

### On Desktop
- Use the *Left Arrow* and *Right Arrow* keys to move the basket left and right.

---

## Screenshots

### Landing Page
![Landing Page](./assets/screenshot1.png)

### Main Game Screen
![Main Game](./assets/screenshot1.png)

### Responsive Design in Action
![Responsive Design](./assets/screenshot3.png)

### Results Page
![Results Page](./assets/screenshot3.png)

---

## Video Demonstration

Watch the video below to see how the game works.

[![Quiz Game Demo](./assets/video-thumbnail.png)](https://www.youtube.com/watch?v=your-video-link)

---

## API

The quiz data is fetched from a backend API. Here's the endpoint for the quiz data:
Note: This is a custom backend in Express JS to receive data from an external API and forward to the Frontend of the Application.

http://localhost:5000/api/proxy


This API provides:
- questions: Array of quiz questions.
- max_mistake_count: The maximum number of mistakes allowed before the game ends.
- correct_answer_marks: The number of points awarded for a correct answer.
- negative_marks: The penalty for an incorrect answer.

---

## Contributing

Feel free to fork the repository and submit pull requests. If you'd like to contribute to the project, please follow these steps:

1. Fork the repo
2. Create a new branch (git checkout -b feature/your-feature)
3. Commit your changes (git commit -am 'Add your feature')
4. Push to the branch (git push origin feature/your-feature)
5. Create a new Pull Request

---

## Acknowledgements

- [React](https://reactjs.org/)
- [React Router](https://reactrouter.com/)
- [HTML5](https://www.w3.org/TR/html5/)
- [CSS3](https://www.w3.org/TR/css3/)
- Custom API for quiz data.(https://api.jsonserve.com/Uw5CrX)

---

## Next Steps

1. *Mobile Optimization*: Further improve the touch controls and responsiveness.
2. *Improve Quiz Data*: Integrate with an external API to pull quiz questions dynamically.
3. *Use of AI*: Integrate with a Generative AI API.
