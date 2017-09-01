Included in this folder is:
  html_schema.sql
    -I used MySQLWorkbench to assemble, export and import the schema.
    -In order to get the DB running:
      1. Open MySQLWorkbench
      2. In the menubar, select 'Server'-> 'Data Import'
      3. Click the 'Import from self-contained file' radio button and choose html_schema.sql
      4. Start the import

  html_db_schema.txt
    -If the above doesn't work, use the mySQL statements in html_db_schema.txt to manually create the the tables without the existing data.

  avg_query.txt
    -Includes the query used to select the average scores for each keyname
