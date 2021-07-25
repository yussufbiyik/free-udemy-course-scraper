# Udemy Free Course Scraper
Scrape free Udemy courses from Telegram channels.

---
**NOTE**

This script only scrapes one free course at a time (since it was all that i needed) but you can easily change that by altering the source code.

---

## How to use?
You have to have node.js on your machine.

1. Download Packages
    * Open terminal in the directory of scraper and type `"npm install"`.
2. Editing `"config.json"`
    * By default `"config.json"` already has a Telegram channel link on it but you can change the channel to any other Telegram channel that sends their free course links as direct links to Udemy.
    
    * If you want to change the link, just change the value of `"telegram_channel"`.
    ---
    **NOTE**
    Before adding the link of the channel make sure the link shows inspection of messages in the channel.

    ---
3. Running the scraper
    * Open your terminal in the directory of the scraper and type `node index.js` and it will automatically log the latest free course with it's name to the terminal.
    * Example Output:
        ```PowerShell
        {
        name: 'Course Name',
        url: 'https://www.udemy.com/course/../?couponCode=...'
        }
        Finished
        ```
