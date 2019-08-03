<p>
  <p align="left">
  <h1>My Kitchen Diary</h1>
  <span>
    <img alt="APM" src="https://img.shields.io/apm/l/vim-mode">
  </span>
  <span>
    <img alt="Supports iOS and Android" src="https://img.shields.io/badge/platform-ios%20%7C%20android-lightgrey">
   </span>
   <span>
    <img alt="In development" src="https://img.shields.io/badge/status-in%20development-yellow">
   </span>
  </p>
</p>

## Contents
- [Description](https://github.com/hiepqphan/my-kitchen-diary#description)
- [Installation](https://github.com/hiepqphan/my-kitchen-diary#installation)
- [Developed features](https://github.com/hiepqphan/my-kitchen-diary#developed-features)
  - [Authentication](https://github.com/hiepqphan/my-kitchen-diary#authentication)
  - [Create a recipe](https://github.com/hiepqphan/my-kitchen-diary#create-a-recipe)
  - [View recipes list](https://github.com/hiepqphan/my-kitchen-diary#view-recipes-list)
- [Features in development](https://github.com/hiepqphan/my-kitchen-diary#features-in-development)
  - [Edit recipe](https://github.com/hiepqphan/my-kitchen-diary#edit-recipe)
  - [Follow a recipe](https://github.com/hiepqphan/my-kitchen-diary#follow-a-recipe)
- [Credits](https://github.com/hiepqphan/my-kitchen-diary#credits)
- [License](https://github.com/hiepqphan/my-kitchen-diary#license)

## Description
**My kitchen diary** is built using <a href="https://github.com/facebook/react-native" target="_blank" rel="noopener noreferrer">React Native</a>
and development tool <a href="https://github.com/expo/expo-cli" target="_blank" rel="noopener noreferrer">Expo CLI</a>. The app functions 
as a diary for cooking enthusiasts, letting them enter and save recipes and follow along a recipe to cook a meal, which upon completion
can be saved along with notes, images and/or videos. All user data (created recipe, cooked meals, etc.) are stored on Google's Firebase.

## Installation
The app is still in development.

## Developed features
### Authentication
User can login with Facebook, which is currently the only login option.

### Create a recipe
<p align="center"/>
  <img alt="Creating recipe" src="https://firebasestorage.googleapis.com/v0/b/hqp-portfolio.appspot.com/o/showcase%2Fcreaterecipe_example.png?alt=media&token=037b7e7f-332b-4b4d-996a-df8409159757">
</p>
Editable options for a recipe:

**Recipe title**:
Can be empty. Doesn't have to be unique.

**Tags**:
Available tags include `appetizer, main course, dessert, drink, cake, noodles, pasta, bread, breakfast, lunch, dinner`. This is mainly for
filtering.

**Ingredients**:
Each ingredient has ingredient name and quanity.

**Instructions**:
A text specifying the instructions for this recipe.

**Images**:
User can choose images and/or videos from their phone to upload along with the recipe.

### View recipes list
Recipes are displayed as a list on the home screen, with recipe title, a thumbnail (if an image was uploaded with the recipe upon creation),
and preview tags.

## Features in development
### Edit Recipe
The base for this feature is ready, which includes: swiping left gesture to show delete button, sending data of clicked recipe to render its
information in another screen.
### Follow a recipe
This should be developed after "viewing a recipe" feature is finished.

## Credits
Developer - <a href="https://www.github.com/hiepqphan">Hiep Phan</a>

Designer - <a href="https://www.github.com/hiepqphan">Hiep Phan</a>

Checkout <a href="https://portfolio-hqp.herokuapp.com" target="_blank" rel="noopener noreferrer">my website</a> for other projects.

## License
My kitchen diary is MIT licensed, as found in the LICENSE file.
