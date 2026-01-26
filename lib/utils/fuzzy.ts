export function getLevenshteinDistance(a: string, b: string): number {
    const matrix = [];

    // Increment along the first column of each row
    let i;
    for (i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    // Increment each column in the first row
    let j;
    for (j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    // Fill in the rest of the matrix
    for (i = 1; i <= b.length; i++) {
        for (j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) == a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, // substitution
                    Math.min(matrix[i][j - 1] + 1, // insertion
                        matrix[i - 1][j] + 1)); // deletion
            }
        }
    }

    return matrix[b.length][a.length];
}

export function isFuzzyMatch(input: string, targets: string[], threshold = 0.8): boolean {
    const lowerInput = input.toLowerCase().trim();

    // Check for exact substring match first (fast path)
    if (targets.some(t => lowerInput.includes(t.toLowerCase()))) {
        return true;
    }

    // Check words in input against targets
    const inputWords = lowerInput.split(/\s+/);

    for (const target of targets) {
        const lowerTarget = target.toLowerCase();

        // Check regular Levenshtein on the whole target vs input words
        // We want to see if any WORD in the input effectively matches the target
        for (const word of inputWords) {
            const distance = getLevenshteinDistance(word, lowerTarget);
            const maxLength = Math.max(word.length, lowerTarget.length);
            const similarity = 1 - (distance / maxLength);

            if (similarity >= threshold) {
                return true;
            }
        }
    }

    return false;
}
