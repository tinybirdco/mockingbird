import { useEffect, useRef } from 'react'
import {
  createAjvValidator,
  JSONEditor as VanillaJSONEditor,
  JSONEditorPropsOptional as VanillaJSONEditorPropsOptional,
} from 'vanilla-jsoneditor'

import mockingbirdSchema from '@tinybirdco/mockingbird/dist/schema.json'

export default function JSONEditor(props: VanillaJSONEditorPropsOptional) {
  const refContainer = useRef<HTMLDivElement | null>(null)
  const refEditor = useRef<VanillaJSONEditor | null>(null)

  useEffect(() => {
    if (!refContainer.current) return

    refEditor.current = new VanillaJSONEditor({
      target: refContainer.current,
      props: {
        validator: createAjvValidator({ schema: mockingbirdSchema }),
      },
    })

    return () => {
      if (refEditor.current) {
        refEditor.current.destroy()
        refEditor.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (refEditor.current) refEditor.current.updateProps(props)
  }, [props])

  return <div ref={refContainer} className="h-[326px]" />
}
