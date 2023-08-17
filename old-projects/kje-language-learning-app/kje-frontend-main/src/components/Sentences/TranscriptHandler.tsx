export const sharedHandler = (transcript: string, validateAndHighlight: Function, content: string[], uniqueIds: string[]) => {
  transcript.length > 0 && validateAndHighlight(content, transcript, uniqueIds)
}
