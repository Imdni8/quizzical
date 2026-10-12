import { useState, useEffect } from "react";
import clsx from "clsx";
import { decode } from "html-entities";
import "./App.css";

const quizQuestions = 5;
const quizUrl = `https://opentdb.com/api.php?amount=${quizQuestions}&difficulty=easy&type=multiple`;

function App() {
    const [quiz, setQuiz] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [gameChecked, setGameChecked] = useState(false);

    // function for fetching questions from the API
    function startQuiz() {
        fetch(quizUrl)
            .then((res) => res.json())
            .then((data) => {
                const rearrangedArr = data.results.map((result) => {
                    const options = [...result.incorrect_answers];
                    const randoNum = Math.floor(
                        Math.random() * (options.length + 1),
                    );
                    options.splice(randoNum, 0, result.correct_answer);
                    const cleanedOption = options.map((option) =>
                        decode(option),
                    );
                    return {
                        question: decode(result.question),
                        options_arr: cleanedOption,
                        correct_option: result.correct_answer,
                    };
                });

                setGameChecked(false);
                setQuiz(rearrangedArr);
                setSelectedOptions(new Array(quizQuestions).fill(null));
            });
    }

    useEffect(() => console.log(quiz), [quiz]);

    // Tracking selected options indexed based on their question number
    function selectOption(option, QuesIndex) {
        if (!gameChecked) {
            setSelectedOptions((prevArr) => {
                const tempArr = [...prevArr];
                tempArr.splice(
                    QuesIndex,
                    1,
                    selectedOptions[QuesIndex] === option ? null : option,
                );
                return tempArr;
            });
        }
    }

    console.log(selectedOptions);

    // Rendering the quiz
    const quizSection = quiz.map((ques, quesIndex) => {
        return (
            <div key={quesIndex} className="question">
                <p>{ques.question}</p>
                <ul>
                    {ques.options_arr.map((option, optionIndex) => {
                        const isSelected =
                            selectedOptions[quesIndex] === option;
                        const isCorrect =
                            option === quiz[quesIndex].correct_option;

                        const styling = clsx({
                            selected: isSelected && !gameChecked,
                            faded: !isCorrect && gameChecked,
                            correct: gameChecked && isCorrect,
                            incorrect: isSelected && gameChecked && !isCorrect,
                        });
                        return (
                            <li
                                key={optionIndex}
                                onClick={() => selectOption(option, quesIndex)}
                                className={styling}
                            >
                                {option}
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    });

    // rendering controls based on game state and score in the end
    function GameControls() {
        const allAttempted = selectedOptions.every((option) => option !== null);

        // Hide during game
        if (selectedOptions.length === 0) {
            return null;
        }
        // show when user attempts all questions
        else if (allAttempted && !gameChecked) {
            return (
                <button onClick={() => setGameChecked(true)}>
                    Check answers
                </button>
            );
        }
        // render score
        else if (gameChecked) {
            const correct_attempts = selectedOptions.filter(
                (option, index) => quiz[index].correct_option === option,
            );
            const score = correct_attempts.length + "/" + quiz.length;

            return (
                <section className="score">
                    <p>You scored {score} correct answers</p>
                    <button onClick={startQuiz}>Play again</button>
                </section>
            );
        }
    }

    return (
        <main>
            {quiz.length > 0 ? null : (
                <section className="intro">
                    <h1>Quizzical</h1>
                    <p>Click to begin</p>
                    <button onClick={startQuiz}>Start quiz</button>
                </section>
            )}

            <section className="quizSection">{quizSection}</section>

            <GameControls />
        </main>
    );
}

export default App;
