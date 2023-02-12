# Udemy Free Course Scraper
Scrape free Udemy courses from Telegram channels.

## How to use?
You have to have node.js on your machine.

1. Download Packages
    * Open terminal in the directory of scraper and type `"npm install"`.
2. Editing `"config.json"`
    * If you want to change the channel, just change the value of `"telegram_channel"`.
    * If you want to scrape more than one link from a channel, change `"mode"` to `all-from-one` and if you just want to scrape the latest link, you can use `single` mode.
    ---
    **NOTE**

    Before adding the link of the channel make sure the link shows inspection of messages in the channel.

    I guess those links mostly starts with `"https://t.me/s/..."`

    ---
3. Running the scraper
    * Open your terminal in the directory of the scraper and type `node index.js` and it will automatically log the latest free course with it's name to the terminal.
    * Example Output:
        ```
        {
            name: 'Course Name',
            url: 'https://www.udemy.com/course/../?couponCode=...',
            from: 'https://t.me/s/...'
        }
        ```
## Result Screenshot
![image](https://user-images.githubusercontent.com/25200573/218332283-9332f1eb-15eb-4456-8932-0a2fb55d668d.png)
