# vk-photo-downloader-bot
VK bot that allows you to download all photo attachments as single archive.

**Use case:**

  - Forward a message with images to a bot, it will download all photo attachments (including from nested forwarded messages)
  and replies with an archive with all of them packed together
  - You also may pick wished photos orientation, bot will rotate photos if it needed
  
**Example:**

![](https://psv4.userapi.com/c856232/u161846336/docs/d12/550b09676d4e/ezgif_com-video-to-gif_1.gif?extra=JmgCSJGnqDA7kbWzP-HGvosONHN2B7RrTYrM5ALKVARtjcnYuXQNQZZvwcANgQq65odobImDxJjyowg7pKp8sX-J6-5J7lK0E6-e3q71RMSvI5yS6GG5b84ravpfFl0Z4UPx0EQ7DC9iWj3IWWibP98)

# How to run it locally

- Clone repository

  `git clone https://github.com/proxodilka/vk-photo-downloader-bot.git`
- Run main script

  `python3 main.py` it will generate `config.json` which you need to fill with your [access token](https://vk.com/dev/access_token) and group id.
- Run main script again

  `python3 main.py`
- You rock!
