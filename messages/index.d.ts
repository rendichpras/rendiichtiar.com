interface Messages {
  common: {
    navigation: {
      home: string
      about: string
      guestbook: string
      contact: string
      playground: string
      apps: string
      socials: string
      close_menu: string
      open_menu: string
      nav_menu: string
      main_menu: string
    }
    theme: {
      toggle: string
      light: string
      dark: string
      system: string
      current_dark: string
      current_light: string
    }
    footer: {
      copyright: string
      aria_label: string
      social: {
        github: string
        linkedin: string
        instagram: string
      }
    }
    language_switcher: {
      aria_to_en: string
      aria_to_id: string
      tooltip_id: string
      tooltip_en: string
      flag_id_alt: string
      flag_en_alt: string
    }
    back_to_top: {
      aria_label: string
      tooltip: string
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
    validation: {
      forbidden_words: {
        error: string
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

  pages: {
    home: {
      greeting: string
      location: string
      remote_worker: string
      bio: string
      tech_stack: string
      tech_stack_desc: string
      work_title: string
      work_desc: string
      lets_work: string
      work_cta: string
      contact_me: string
      verified: string
      to_home: string
    }

    about: {
      title: string
      subtitle: string
      sections: {
        intro: string
        career: string
        education: string
      }
      intro: {
        headline: string
        greeting: string
        bio1: string
        bio2: string
        bio3: string
        bio4: string
        bio5: string
        closing: string
      }
      career: {
        empty: string
        headline: string
      }
      education: {
        headline: string
        upb: {
          name: string
          major: string
          period: string
          location: string
        }
        smk: {
          name: string
          major: string
          period: string
          location: string
        }
      }
    }

    guestbook: {
      title: string
      subtitle: string
      form: {
        placeholder: string
        empty_error: string
        session_error: string
        success: string
        error: string
        forbidden_words: string
        sending: string
        send: string
      }
      auth: {
        sign_in_message: string
      }
      list: {
        title: string
        subtitle: string
        empty: string
        owner: string
        reply: {
          button: string
          placeholder: string
          cancel: string
          sending: string
          send: string
          success: string
          error: string
        }
        like: {
          error: string
        }
        show_replies: string
        hide_replies: string
      }
    }

    contact: {
      title: string
      subtitle: string
      social: {
        title: string
        email: string
        linkedin: string
        facebook: string
        instagram: string
        github: string
      }
      call: {
        title: string
        subtitle: string
        platform: string
        duration: string
        button: string
      }
      form: {
        title: string
        name: {
          label: string
          placeholder: string
        }
        email: {
          label: string
          placeholder: string
        }
        message: {
          label: string
          placeholder: string
        }
        response_time: string
        sending: string
        send: string
        success: string
        validation: {
          name: string
          email: string
          message: string
        }
        error: {
          general: string
        }
      }
    }

    playground: {
      title: string
      subtitle: string
      editor: {
        language: string
        actions: {
          clear: string
          fullscreen: string
          run: string
        }
      }
      console: {
        title: string
        clear: string
        output_label: string
      }
      errors: {
        code_too_long: string
        blocked_keyword: string
        validation_error: string
        editor_not_ready: string
        runtime_error: string
      }
    }
  }

  admin: {
    contact: {
      title: string
      subtitle: string
      table: {
        columns: {
          date: string
          name: string
          email: string
          message: string
          status: string
          actions: string
        }
        status: {
          unread: string
          read: string
          replied: string
        }
        actions: {
          reply: string
          replied: string
        }
        search: string
        columns_button: string
        empty: string
        total_messages: string
        pagination: {
          previous: string
          next: string
        }
      }
      reply_dialog: {
        title: string
        subtitle: string
        original_message: string
        placeholder: string
        cancel: string
        sending: string
        send: string
      }
      notifications: {
        load_error: string
        reply_success: string
        reply_error: string
      }
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
}

declare module "@/messages/id" {
  const messages: Messages
  export default messages
}

declare module "@/messages/en" {
  const messages: Messages
  export default messages
}
