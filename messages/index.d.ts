declare module "@/messages/id" {
  const messages: {
    navigation: {
      home: string
      about: string
      guestbook: string
      contact: string
      playground: string
      apps: string
      close_menu: string
      open_menu: string
      nav_menu: string
      main_menu: string
    }
    metadata: {
      home: {
        title: string
        description: string
        keywords: string[]
        og_alt: string
      }
      about: {
        title: string
        description: string
      }
      guestbook: {
        title: string
        description: string
      }
      contact: {
        title: string
        description: string
      }
      playground: {
        title: string
        description: string
      }
    }
    error: {
      forbidden: {
        title: string
        heading: string
        message: string
        back_home: string
      }
      not_found: {
        title: string
        heading: string
        message: string
        back_home: string
      }
    }
    api: {
      contact: {
        validation: {
          name: string
          email: string
          message: string
          reply: string
        }
        error: {
          fetch: string
          validation: string
          general: string
          not_found: string
        }
        success: {
          sent: string
          replied: string
        }
        email: {
          admin: {
            subject: string
            title: string
            name_label: string
            email_label: string
            message_label: string
            message_id: string
          }
          user: {
            subject: string
            title: string
            thank_you: string
            message_copy: string
            visit_website: string
            regards: string
            signature: string
          }
          reply: {
            subject: string
            title: string
            greeting: string
            original_message: string
            reply_message: string
            visit_website: string
            regards: string
            signature: string
          }
        }
      }
      guestbook: {
        error: {
          unauthorized: string
          user_not_found: string
        }
      }
    }
    validation: {
      forbidden_words: {
        error: string
      }
    }
    theme: {
      toggle: string
      light: string
      dark: string
      system: string
    }
    footer: {
      copyright: string
      social: {
        github: string
        linkedin: string
        instagram: string
      }
    }
    auth: {
      login: {
        title: string
        description: string
        google: string
        github: string
      }
    }
  }
  export default messages
}

declare module "@/messages/en" {
  const messages: {
    navigation: {
      home: string
      about: string
      guestbook: string
      contact: string
      playground: string
      apps: string
      close_menu: string
      open_menu: string
      nav_menu: string
      main_menu: string
    }
    metadata: {
      home: {
        title: string
        description: string
        keywords: string[]
        og_alt: string
      }
      about: {
        title: string
        description: string
      }
      guestbook: {
        title: string
        description: string
      }
      contact: {
        title: string
        description: string
      }
      playground: {
        title: string
        description: string
      }
    }
    error: {
      forbidden: {
        title: string
        heading: string
        message: string
        back_home: string
      }
      not_found: {
        title: string
        heading: string
        message: string
        back_home: string
      }
    }
    api: {
      contact: {
        validation: {
          name: string
          email: string
          message: string
          reply: string
        }
        error: {
          fetch: string
          validation: string
          general: string
          not_found: string
        }
        success: {
          sent: string
          replied: string
        }
        email: {
          admin: {
            subject: string
            title: string
            name_label: string
            email_label: string
            message_label: string
            message_id: string
          }
          user: {
            subject: string
            title: string
            thank_you: string
            message_copy: string
            visit_website: string
            regards: string
            signature: string
          }
          reply: {
            subject: string
            title: string
            greeting: string
            original_message: string
            reply_message: string
            visit_website: string
            regards: string
            signature: string
          }
        }
      }
      guestbook: {
        error: {
          unauthorized: string
          user_not_found: string
        }
      }
    }
    validation: {
      forbidden_words: {
        error: string
      }
    }
    theme: {
      toggle: string
      light: string
      dark: string
      system: string
    }
    footer: {
      copyright: string
      social: {
        github: string
        linkedin: string
        instagram: string
      }
    }
    auth: {
      login: {
        title: string
        description: string
        google: string
        github: string
      }
    }
  }
  export default messages
} 