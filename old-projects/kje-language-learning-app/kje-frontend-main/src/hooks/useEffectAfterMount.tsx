import { useRef, useEffect } from 'react'

export const useEffectAfterMount = (cb: Function, deps: any) => {
  const componentJustMounted = useRef(true)
  useEffect(() => {
    if (!componentJustMounted.current) {
      return cb()
    }
    componentJustMounted.current = false

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
