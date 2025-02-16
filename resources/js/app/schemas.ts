import * as yup from "yup"

export const retrieveReportFormSchema = yup.object({
	username: yup
		.string()
		.required({ name: 'required' }),
})