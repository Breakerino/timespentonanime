//
import { has, isEmpty, isObject, omit, set, template } from 'lodash'
import React from 'react'
import { FieldValues, Validate } from 'react-hook-form'
import { Schema } from 'yup'

export interface UseValidationResolverProps {
	schema: Schema
	messages: Record<string, string>
}

export const formatValidationError = (error: Record<string, unknown>, { messages }: {messages: Record<string, unknown>}) => {
	const formatMessage = (content: string, data: Record<string, unknown>) => template(content, {
		evaluate: /\{\{(.+?)\}\}/g,
		interpolate: /\{\{(.+?)\}\}/g,
		escape: /\{\{-(.+?)\}\}/g,
	})(data);

	const field = {
		// @ts-expect-error IDK
		...omit(error.params, ['value', 'originalValue', 'path']),
	};

	// @ts-expect-error IDK
	return error?.type in messages ? formatMessage(messages[error.type], { field }) : null;
}

const useValidationResolver = ({ schema, messages }: {schema: Schema, messages: Record<string, unknown>}) => {
	return React.useCallback(
		async (data: FieldValues, context: unknown, options: Record<string, unknown>) => {
			const errors = {};

			// Yup validation
			try {
				await schema.validate(data, {
					abortEarly: false,
					stripUnknown: false,
					strict: false,
				})
			} catch (validationResult) {
				for (const error of (validationResult as Record<string, Record<string, string>[]>).inner) {
					set(errors, error.path, { id: error.type, type: "validation", message: formatValidationError(error, { messages }) })
				}
			}

			// Custom validation
			for (const [path, field] of Object.entries<string, Record<string, unknown>>(options.fields)) {
				if (has(errors, path)) {
					continue;
				}

				if (isEmpty(field?.validate) || !isObject(field?.validate)) {
					continue;
				}

				// @ts-expect-error IDK
				for (const validationCallback of Object.values<Validate<unknown, FieldValues>>(field.validate)) {
					const validationResult = await validationCallback(field.value, data);

					if (validationResult === true) {
						continue;
					}

					set(errors, path, { id: validationResult, type: "validation", message: formatValidationError({type: validationResult, params: {path, value: field.value}}, { messages }) });
				}
			}

			return {
				errors,
				values: omit(data, Object.keys(errors))
			}
		},
		[schema, messages]
	)
}

export default useValidationResolver;