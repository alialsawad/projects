import { Button } from 'components/Button'
import { DecoderText } from 'components/DecoderText'
import { Divider } from 'components/Divider'

import { Heading } from 'components/Heading'
import { Icon } from 'components/Icon'
import { Input } from 'components/Input'
import { Meta } from 'components/Meta'
import { Section } from 'components/Section'
import { Text } from 'components/Text'
import { tokens } from 'components/ThemeProvider/theme'
import { Transition } from 'components/Transition'
import { useFormInput } from 'hooks'
import { useRef, useState } from 'react'
import { cssProps, msToNum, numToMs } from 'utils/style'
import styles from './Contact.module.css'

export const Contact = () => {
  const errorRef = useRef<HTMLDivElement>(null)
  const email = useFormInput('')
  const message = useFormInput('')
  const [sending, setSending] = useState(false)
  const [complete, setComplete] = useState(false)
  const [statusError, setStatusError] = useState('')
  const initDelay = tokens.base.durationS

  interface onSubmit {
    (e: React.FormEvent<HTMLFormElement>): void
  }

  const onSubmit: onSubmit = async (event) => {
    event.preventDefault()
    setStatusError('')

    if (sending) return

    try {
      setSending(true)

      const response = await fetch('https://formspree.io/f/mqkjbpyd', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email.value,
          message: message.value
        })
      })
      const responseMessage = await response.json()

      const statusError = getStatusError({
        status: response?.status,
        errorMessage: responseMessage?.error,
        fallback: 'There was a problem sending your message'
      })

      if (statusError) throw new Error(statusError)

      setComplete(true)
      setSending(false)
    } catch (error) {
      setSending(false)
      if (error instanceof Error) setStatusError(error.message)
    }
  }

  return (
    <Section className={styles.contact}>
      <Meta title="Contact" description="Send me a message if you’re interested in discussing a project or if you just want to say hi" />
      <Transition unmount in={!complete} timeout={1600}>
        {(_: boolean, status: string) => (
          <form className={styles.form} method="post" onSubmit={onSubmit}>
            <Heading
              className={styles.title}
              data-status={status}
              level={3}
              as="h1"
              style={getDelay(tokens.base.durationXS, initDelay, 0.3)}>
              <DecoderText text="Say hello" start={status !== 'exited'} delay={300} />
            </Heading>
            <Divider className={styles.divider} data-status={status} style={getDelay(tokens.base.durationXS, initDelay, 0.4)} />
            <Input
              required
              className={styles.input}
              data-status={status}
              style={getDelay(tokens.base.durationXS, initDelay)}
              autoComplete="email"
              label="Your Email"
              type="email"
              maxLength={512}
              {...email}
            />
            <Input
              required
              multiline
              className={styles.input}
              data-status={status}
              style={getDelay(tokens.base.durationS, initDelay)}
              autoComplete="off"
              label="Message"
              maxLength={4096}
              {...message}
            />
            <Transition in={statusError} timeout={msToNum(tokens.base.durationM)}>
              {(errorStatus: boolean) => (
                <div
                  className={styles.formError}
                  data-status={errorStatus}
                  style={cssProps({
                    height: errorStatus ? (errorRef.current?.offsetHeight as number) : 0
                  })}>
                  <div className={styles.formErrorContent} ref={errorRef}>
                    <div className={styles.formErrorMessage}>
                      <Icon className={styles.formErrorIcon} icon="error" />
                      {statusError}
                    </div>
                  </div>
                </div>
              )}
            </Transition>
            <Button
              className={styles.button}
              data-status={status}
              data-sending={sending}
              style={getDelay(tokens.base.durationM, initDelay)}
              disabled={sending}
              loading={sending}
              loadingText="Sending..."
              icon="send"
              type="submit">
              Send message
            </Button>
          </form>
        )}
      </Transition>
      <Transition unmount in={complete}>
        {(_: boolean, status: string) => (
          <div className={styles.complete} aria-live="polite">
            <Heading level={3} as="h3" className={styles.completeTitle} data-status={status}>
              Message Sent
            </Heading>
            <Text size="l" as="p" className={styles.completeText} data-status={status} style={getDelay(tokens.base.durationXS)}>
              I’ll get back to you within a couple days, sit tight
            </Text>
            <Button
              secondary
              iconHoverShift
              className={styles.completeButton}
              data-status={status}
              style={getDelay(tokens.base.durationM)}
              href="/"
              icon="chevronRight">
              Back to homepage
            </Button>
          </div>
        )}
      </Transition>
    </Section>
  )
}

interface GetStatusErrorProps {
  status: number
  errorMessage: string
  fallback: string
}
function getStatusError({ status, errorMessage, fallback = 'There was a problem with your request' }: GetStatusErrorProps) {
  if (status === 200) return false

  const statuses: { [key: number]: string } = {
    500: 'There was a problem with the server, try again later',
    404: 'There was a problem connecting to the server. Make sure you are connected to the internet'
  }

  if (errorMessage) {
    return errorMessage
  }

  return statuses[status] || fallback
}
interface GetDelay {
  (duration: string, offset?: string, delay?: number): object
}
const getDelay: GetDelay = (delayMs, offset = numToMs(0), multiplier = 1) => {
  const numDelay = msToNum(delayMs) * multiplier
  return cssProps({ delay: numToMs(Number((msToNum(offset) + numDelay).toFixed(0))) })
}
