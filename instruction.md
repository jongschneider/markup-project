BuiltUsing the following tools:
1. Node v8.1.2
2. mysql v5.7.19
3. Mac osSierra v10.12.6
4. MySQLWorkbench v6.3.9


Initial Setup:
1. Set up the database using the instructions found in 'schema/README.md'
2. CD into 'src' and from the terminal, run 'npm i' to install all the dependencies.
3. Open 'src/handlers/config.js' and include your mysql password to root on localhost to allow you to connect to your database.
4. CD into 'src' and from the terminal, run 'npm start' to begin running in dev mode with nodemon on 'http://localhost:7777/', or use 'node app.js' to run normally


Site use
1. Score File and Insert Into DB User Story
*Select a file from the dropdown and click 'Score File' button
  a. Select a file from the dropdown and click 'Score File' button
  b. You will be directed to a new page with the files information, score and a printout of the content within the selected html file.

2. Search DB User Story
  a. Navigate to the search page via the 'Search' button in the navigation bar.
  b. Search by file or key
    -Selecting 'All' from either dropdown will generate a total list of files
    -Below the total list of files will be the Averages or either all file scores or all scores according to keys.

3. Method: Retrieve scores for a unique id
  a. Navigate to the search page via the 'Search' button in the navigation bar.
  b. Choose the unique id via the 'Choose a Key' dropdown

4. Method: Retrieve all scores run in the system for a custom date range
  a. Navigate to the search page via the 'Search' button in the navigation bar.
  b. Use the 'Select Files Within a Range of Dates' date picker
    -Make sure to click the green 'Apply' button at the top-right of the date-picker to set the values that will be sent to the DB.
  c. Click 'Submit' button

5. Method: Retrieve highest scored unique id
  a. Navigate to the search page via the 'Search' button in the navigation bar.
  b. Click 'Get Highest Scored Unique Item' button

6. Method: Retrieve lowest scored unique id
  a. Navigate to the search page via the 'Search' button in the navigation bar.
  b. Click 'Get Lowest Scored Unique Item' button

7. Method: find the average score across each key.
  a. Navigate to the search page via the 'Search' button in the navigation bar.
  b. Choose a Key = 'All' and click 'Submit'
  c. Scroll down to the bottom of the page and there is a table of all of the unique keys and their average scores.

8. Update existing html files or add new files to score.
  a. In order to update existing files, you must manually go into the 'data' directory and open the desired file and change it. Once saved, it will be ready to be scored.
  b. In order to add new files, you must manually go into the 'data' directory and add the desired file. Once saved, it will be ready to be scored.
