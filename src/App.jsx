import { useState, useEffect } from "react";
import clsx from "clsx";
import { decode } from "html-entities";
import "./App.css";

const quizQuestions = 5;
const quizUrl = `https://opentdb.com/api.php?amount=${quizQuestions}&difficulty=easy&type=multiple`;

function App() {
    const [quiz, setQuiz] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState(
        new Array(quizQuestions).fill(null),
    );

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
                    return {
                        question: decode(result.question),
                        options_arr: options,
                        correct_option: result.correct_answer,
                    };
                });

                setQuiz(rearrangedArr);
            });
    }

    useEffect(() => console.log(quiz), [quiz]);

    // Tracking selected options indexed based on their question number
    function selectOption(option, QuesIndex) {
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

    console.log(selectedOptions);

    // Rendering the quiz
    const quizSection = quiz.map((ques, QuesIndex) => {
        return (
            <div key={QuesIndex} className="question">
                <p>{ques.question}</p>
                <ul>
                    {ques.options_arr.map((option, OptionIndex) => {
                        const styling = clsx({
                            selected: selectedOptions[QuesIndex] === option,
                        });
                        return (
                            <li
                                key={OptionIndex}
                                onClick={() => selectOption(option, QuesIndex)}
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

            {selectedOptions.every((option) => option !== null) && (
                <button>Check answers</button>
            )}
        </main>
    );
}

export default App;
