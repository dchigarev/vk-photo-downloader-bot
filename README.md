# vk-photo-downloader-bot
VK bot that allows you to download all photo attachments as single archive.

**Use case:**

  - Forward a message with images to a bot, it will download all photo attachments (including from nested forwarded messages)
  and replies with an archive with all of them packed together
  - You also may pick wished photos orientation, bot will rotate photos if it needed
  
**Example:**

![demo](https://s5.gifyu.com/images/Untitle4d-1.gif)

# How to run it locally

- Clone repository

  `git clone https://github.com/proxodilka/vk-photo-downloader-bot.git`
- Run main script

  `python3 main.py` it will generate `config.json` which you need to fill with your [access token](https://vk.com/dev/access_token) and group id.
- Run main script again

  `python3 main.py`
- You rock!
