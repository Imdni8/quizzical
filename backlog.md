# Screen 1: Begin game

User can see the quiz by clicking on "start game". Today, we render the quiz directly without checking the response type. For example, rate limiting.

- ~~Title~~
- ~~description~~
- ~~button for starting quiz~~
- check response code and render quiz only on code 0 (success)
- stretch: select number of trivia to fetch: upto 20

# Screen 2: Attempt the quiz

In this screen, the fetched quiz is rendered. User can attempt each question by selecting. Once they're are done with all the questions, the "check answers" btn activates.

- ~~- render question with options~~
    - ~~handle HTML entities like &quot; and &#039;~~

- ~~randomise the correct option's place~~
    - spliced the incorrect array and inserted the correct answer randomly. But selecting an option rerendered the quiz section -> which means the order of the options changed because of the new random number
    - Next, I thought of using an userffect to run the randomizer function only once. But I found out that on every re-render because it's not running splice is using 0 as the default index, So we are back to square one.
    - So finally I consulted an LLM and it suggested I should do the randomizing while setting the state so that it never changes on rerenders. I knew I should save anything that I want persisted across re-renders in state. And I was doing that, but in this particular case, the object I was saving needed extra arrangement. It being the randomizing of the correct option.

- ~~change UI of the option when it's selected~~
    - ~~create an array as state to track all selected options~~
    - ~~add them to this array, each push rerendering the option as selected~~

- ~~only one option per question should be selectable~~

- ~~on selecting answers for all questions, activate the "Check answers" btn.~~

### things to note

- if for some reason, an option is shared by two questions, for eg, year "2009", then selecting it for one question will select it for the questions

# Screen 3: Quiz result

Reveal correct answers, final score and ability to start a new game

- On clicking "check answers"
    - init a score with 0
    - map over quiz, match correct_answer prop with selected options for each index -> on match, increment score.
    - turn correctly selected options green and incorrectly selected red
    - show score and btn for starting a new game
