/**
 * Fisher-Yates shuffle algorithm (returns a new array)
 */
export function shuffleArray(arr) {
  const array = [...arr];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Prepares a list of questions for a student session.
 * Optionally shuffles question sequence and option sequence,
 * preserving accurate correct index references.
 */
export function prepareExamQuestions(questions, shuffleQuestions = true, shuffleOptions = true) {
  let list = [...questions];

  if (shuffleQuestions) {
    list = shuffleArray(list);
  }

  return list.map((q) => {
    if (!shuffleOptions || !q.options || q.options.length === 0) {
      return { ...q };
    }

    // Pair each option with its original index
    const indexedOptions = q.options.map((opt, idx) => ({
      text: opt,
      originalIndex: idx
    }));

    const shuffledIndexedOptions = shuffleArray(indexedOptions);
    const newOptions = shuffledIndexedOptions.map((item) => item.text);
    const newCorrectIndex = shuffledIndexedOptions.findIndex(
      (item) => item.originalIndex === q.correctIndex
    );

    return {
      ...q,
      options: newOptions,
      correctIndex: newCorrectIndex,
      originalQuestionId: q.id
    };
  });
}
