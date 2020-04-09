import React from 'react'

const AboutApp = () => {
  return (
    <div className="aboutApp">
      <h1 className="welcome-title">WhatsApp Chat Viewer</h1>
      <div className="paragraph-1">
        <p>
          WhatsApp chat viewer is an online tool that allows you to view your
          WhatsApp exported chats. The web doesn't store any user data it only
          formats the chat messages in a more visual way in order to help users
          to read exported chats.
        </p>
      </div>

      <div className="paragraph-2">
        <p>
          In order to be able to use this tool, you will need an exported
          WhatsApp chat. This file has the extension txt. Bellow, I will show
          you how you can export a WhatsApp chat.
        </p>

        <h2>How to export a WhatsApp Chat?</h2>
        <p>Follow the "Export chat history" part of the tutorials bellow.</p>
        <p>
          <a href="https://faq.whatsapp.com/en/android/23756533/">
            For Android devices
          </a>
        </p>
        <p>
          <a href="https://faq.whatsapp.com/en/iphone/26000285/?category=5245251">
            For iPhone devices
          </a>
        </p>

        <h2>About this project.</h2>
        <p>
          This is a personal project developed by{' '}
          <a href="https://github.com/MonkeyAndres">@MonkeyAndres</a>. Is
          completely free and open source. You can access the source code{' '}
          <a href="https://github.com/MonkeyAndres/whatsapp-chat-viewer">
            here.
          </a>
        </p>

        <br />
      </div>
    </div>
  )
}

export default AboutApp
