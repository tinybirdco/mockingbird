import Ajv from 'ajv'
import { JSONValue, parsePath } from 'immutable-json-patch'
import _uniqBy from 'lodash.uniqby'
import { useEffect, useRef } from 'react'
import {
  ValidationError,
  ValidationSeverity,
  JSONEditor as VanillaJSONEditor,
  JSONEditorPropsOptional as VanillaJSONEditorPropsOptional,
} from 'vanilla-jsoneditor'

import mockingbirdSchema from '@tinybirdco/mockingbird/dist/Schema.json'

const createAjvValidator = () => {
  const ajv = new Ajv({
    allErrors: true,
    verbose: true,
    $data: true,
  })

  const validateAjv = ajv.compile(mockingbirdSchema)

  return (json: JSONValue): ValidationError[] => {
    validateAjv(json)
    const ajvErrors = validateAjv.errors || []

    return _uniqBy(
      ajvErrors.map(ajvError => ({
        path: parsePath(json, ajvError.instancePath),
        message: 'Invalid schema value',
        severity: ValidationSeverity.warning,
      })),
      ajvError => ajvError.path[0]
    )
  }
}

export default function JSONEditor(props: VanillaJSONEditorPropsOptional) {
  const refContainer = useRef<HTMLDivElement | null>(null)
  const refEditor = useRef<VanillaJSONEditor | null>(null)

  useEffect(() => {
    if (!refContainer.current) return

    refEditor.current = new VanillaJSONEditor({
      target: refContainer.current,
      props: {
        validator: createAjvValidator(),
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
