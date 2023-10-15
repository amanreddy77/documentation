import {Box, Text} from '@primer/react'
import Highlight, {defaultProps} from 'prism-react-renderer'
import githubTheme from 'prism-react-renderer/themes/github'
import React, {useState, useEffect} from 'react'
import ClipboardCopy from '../components/clipboard-copy'
import BorderBox from '../components/border-box'

/**
 * Resize the scroll handle to the size of the code contents, since the former has to be positioned absolutely.
 */
const useScrollSize = () => {
  const scrollRef = React.createRef()
  const paddingRef = React.createRef()
  const [size, setSize] = useState({})

  useEffect(() => {
    const scrollNode = scrollRef.current
    const paddingNode = paddingRef.current

    if (!scrollNode || !paddingNode || typeof size.width !== 'undefined') {
      return
    }

    const parent = scrollNode.parentElement
    const button = paddingNode.firstChild

    parent.style.position = 'relative'
    const parentStyle = getComputedStyle(parent)
    const paddingTop = parseInt(parentStyle.paddingTop, 10)
    const paddingBottom = parseInt(parentStyle.paddingBottom, 10)
    const paddingRight = parseInt(parentStyle.paddingRight, 10)

    setSize({
      height: parent.clientHeight - paddingTop - paddingBottom,
      width: parent.scrollWidth - paddingRight + button.clientWidth,
    })
  }, [scrollRef, paddingRef, size])

  return {scrollRef, paddingRef, size}
}

function Code({className: parentClass, children}) {
  const language = parentClass ? parentClass.replace(/language-/, '') : ''
  const code = children.trim()
  const {scrollRef, paddingRef, size} = useScrollSize()

  return (
    <Box position="relative">
      <div ref={paddingRef}>
        <Box position="absolute" top={0} right={0} p={2} zIndex={1}>
          <ClipboardCopy value={code} />
        </Box>
      </div>
      <Highlight {...defaultProps} code={code} language={language} theme={githubTheme}>
        {({className, style, tokens, getLineProps, getTokenProps}) => (
          <BorderBox tabIndex={0} as="pre" className={className} mt={0} mb={3} p={3} border={0} style={{...style, overflow: 'auto'}}>
            {/* This is the scroll handle, it is supposed to be focused with keyboard and scroll a wide codebox horizontally */}
            <div aria-hidden="true" style={{visibility: 'hidden', position: 'absolute', ...size}} ref={scrollRef} />
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({line, key: i})}>
                {line.map((token, key) => (
                  <Text key={key} fontFamily="mono" fontSize={1} {...getTokenProps({token, key})} />
                ))}
              </div>
            ))}
          </BorderBox>
        )}
      </Highlight>
    </Box>
  )
}

export default Code