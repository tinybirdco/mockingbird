'use client';

import { useEffect, useRef } from 'react'
import {
  createJSONEditor,
  JsonEditor,
  JSONEditorPropsOptional,
} from 'vanilla-jsoneditor'

const JSONEditor: React.FC<JSONEditorPropsOptional> = props => {
  const refContainer = useRef<HTMLDivElement>(null)
  const refEditor = useRef<JsonEditor | null>(null)

  useEffect(() => {
    // create editor
    refEditor.current = createJSONEditor({
      target: refContainer.current!,
      props: {
        mode: 'tree',
        mainMenuBar: true,
        navigationBar: true,
        statusBar: true,
        ...props,
      },
    })

    return () => {
      // destroy editor
      if (refEditor.current) {
        refEditor.current.destroy()
        refEditor.current = null
      }
    }
  }, [])

  useEffect(() => {
    // update props
    if (refEditor.current) {
      refEditor.current.updateProps(props)
    }
  }, [props])

  return <div className="vanilla-jsoneditor-react" ref={refContainer} />
}

export default JSONEditor
