using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        while (true)
        {
            PlayGame();

            Console.WriteLine("\nDo you want to play again? (y/n)");
            string again = Console.ReadLine().ToLower();

            if (again != "y")
                break;

            Console.Clear();
        }
    }

    static void PlayGame()
    {
        string[] words = { "apple", "computer", "program", "school", "holiday", "mountain" };
        Random rnd = new Random();
        string chosenWord = words[rnd.Next(words.Length)].ToLower();

        char[] display = new string('_', chosenWord.Length).ToCharArray();
        List<char> guessedLetters = new List<char>();

        int maxGuesses = chosenWord.Length + 5;
        int remainingGuesses = maxGuesses;
        int wrongGuesses = 0;

        while (remainingGuesses > 0)
        {
            Console.Clear();
            Console.WriteLine("Word: " + string.Join(" ", display));
            Console.WriteLine("\nGuessed letters: " + string.Join(", ", guessedLetters));
            Console.WriteLine($"Remaining guesses: {remainingGuesses}\n");

            DrawHangingTree(wrongGuesses);

            Console.Write("\nEnter a letter: ");
            string input = Console.ReadLine().ToLower();

            if (string.IsNullOrWhiteSpace(input) || input.Length != 1)
            {
                Console.WriteLine("Please enter a single letter.");
                Console.ReadKey();
                continue;
            }

            char guess = input[0];

            if (guessedLetters.Contains(guess))
            {
                Console.WriteLine("Already guessed this letter.");
                Console.ReadKey();
                continue;
            }

            guessedLetters.Add(guess);

            bool found = false;

            for (int i = 0; i < chosenWord.Length; i++)
            {
                if (chosenWord[i] == guess)
                {
                    display[i] = guess;
                    found = true;
                }
            }

            if (!found)
                wrongGuesses++;

            remainingGuesses--;

            if (new string(display) == chosenWord)
            {
                Console.Clear();
                DrawHangingTree(wrongGuesses);
                Console.WriteLine("\nYou won!");
                Console.WriteLine($"The word was: {chosenWord}");
                return;
            }
        }

        Console.Clear();
        DrawHangingTree(999); // forces full drawing
        Console.WriteLine("\nGame over!");
        Console.WriteLine($"The word was: {chosenWord}");
    }

    static void DrawHangingTree(int stage)
    {
        // 10 small steps before full man appears
        string[] pic = new string[]
        {
            """
             ______
            |      |
            |
            |
            |
            |
            """,

            """
             ______
            |      |
            |      O
            |
            |
            |
            """,

            """
             ______
            |      |
            |      O
            |      |
            |
            |
            """,

            """
             ______
            |      |
            |      O
            |     /|
            |
            |
            """,

            """
             ______
            |      |
            |      O
            |     /|\\
            |
            |
            """,

            """
             ______
            |      |
            |      O
            |     /|\\
            |      |
            |
            """,

            """
             ______
            |      |
            |      O
            |     /|\\
            |      |
            |     /
            """,

            """
             ______
            |      |
            |      O
            |     /|\\
            |      |
            |     / \\
            """,

            """
             ______
            |      |
            |     (O)
            |     /|\\
            |      |
            |     / \\
            """,

            """
             ______
            |      |
            |    \\(O)/
            |     /|\\
            |      |
            |     / \\
            """
        };

        int index = Math.Min(stage, pic.Length - 1);
        Console.WriteLine(pic[index]);
    }
}