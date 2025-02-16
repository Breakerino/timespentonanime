//
import { Head, Link } from '@inertiajs/react';
import { isEmpty } from 'lodash';
import React from 'react';
import { Controller, FieldValues, FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { Inertia } from '@inertiajs/inertia';

//
import { PageProps } from '@/types';
import useValidationResolver from '@/hooks/useValidationResolver';
import { retrieveReportFormSchema } from '@/app/schemas';
import { VALIDATION_MESSAGES } from '@/app/constants';
import Icon from '@/components/Icon';

export interface FormValues extends FieldValues {
	username: string;
}

const Homepage: React.FC<PageProps> = () => {
	const validationResolver = useValidationResolver({
		schema: retrieveReportFormSchema,
		messages: VALIDATION_MESSAGES
	});

	const form = useForm<FormValues>({
		defaultValues: {
			username: '',
			status: ['any'],
			type: ['any']
		},
		mode: 'onChange',
		// @ts-expect-error IDK
		resolver: validationResolver
	});

	const handleFormSubmit: SubmitHandler<FormValues> = async (values) => {
		if (isEmpty(values.username)) {
			return;
		}

		const queryParams = new URLSearchParams();

		if (!isEmpty(values.status) && !(values.status.length === 1 && values.status[0] === 'any')) {
			queryParams.append('status', values.status.join(','));
		}

		if (!isEmpty(values.type) && !(values.type.length === 1 && values.type[0] === 'any')) {
			queryParams.append('type', values.type.join(','));
		}

		const queryString = queryParams.toString();
		const url = queryString ? `/u/${values.username.toLowerCase()}?${queryString}` : `/u/${values.username.toLowerCase()}`;

		Inertia.visit(url);

		return new Promise(() => { });
	}
	
	React.useEffect(() => {
		const handlePopState = () => {
			form.reset();
			form.clearErrors();
		};

		window.addEventListener('popstate', handlePopState);

		return () => {
			window.removeEventListener('popstate', handlePopState);
		};
	}, [form]);

	return (
		<>
			<Head>
				<meta name="description" content="See how much time you've dedicated to anime! Connect your MyAnimeList profile to get a breakdown of your watch time, ranked animes, and more." />
			</Head>

			<div className="min-h-[100vh] h-full flex flex-col">
				<main className="w-full h-full max-w-7xl flex-1 mt-auto mx-auto px-3 py-12 md:p-6 md:py-20 lg:px-8 flex justify-center items-center flex-col">
					<div className="w-full flex gap-6 md:gap-8 flex-col items-center lg:flex-row lg:justify-between">
						<div className="w-full sm:max-w-[32rem] md:max-w-[42rem] md:w-[80vw] basis-4 flex gap-2 flex-col items-center lg:items-start">
							<h1 className="w-fit h-fit flex flex-col text-center lg:text-left text-white">
								<span className="text-3xl sm:text-4xl lg:text-5xl font-semibold uppercase">Time Spent on&nbsp;</span>
								<span className="text-8xl sm:text-9xl lg:text-9xl font-bold uppercase text-transparent bg-clip-text inline-block bg-gradient-primary -mt-2">Anime</span>
							</h1>
							<p className="text-white text-sm text-center lg:text-left">
								<span className="inline-block lg:inline">See how much time you've dedicated to anime!&nbsp;</span>
								<span className="inline-block lg:inline">Connect your <strong>MyAnimeList</strong> profile to get a breakdown of your watch time, ranked animes, and more.</span>
							</p>
						</div>

						<div className="w-full flex flex-1 flex-col items-center lg:items-end lg:mt-16">
							<FormProvider {...form}>
								<form onSubmit={form.handleSubmit(handleFormSubmit)} className="w-full sm:max-w-[32rem] md:max-w-[42rem] md:w-[80vw] lg:w-full lg:min-w-[28rem] xl:min-w-[32rem] flex flex-col gap-4">
									<div className="flex flex-col sm:flex-row gap-2">
										<input type="text" {...form.register('username')} autoComplete="off" placeholder="Enter your MAL profile name" className="w-full p-4 text-center border-none rounded-md disabled:opacity-75" disabled={form.formState.isLoading || form.formState.isSubmitting || form.formState.disabled} />
										<button type="submit" className="w-full flex items-center justify-center text-center gap-2 sm:max-w-fit bg-gradient-primary text-white font-bold px-12 py-4 border-none disabled:opacity-50 rounded-md bg-[length:125%] bg-[position:75%] hover:bg-[position:0%] transition-background duration-300 ease-in-out"
											disabled={!form.formState.isValid || form.formState.isLoading || form.formState.isSubmitting || form.formState.isValidating || form.formState.disabled || !isEmpty(form.formState.errors)}
										>
											{form.formState.isLoading || form.formState.isSubmitting
												? (
													<span className="spinner !w-6 !h-6 !border-2"></span>
												)
												: (
													<Icon id="general.submit" color="white" className="w-6 h-6" />
												)}
											<span>Let's go!</span>
										</button>
									</div>
									<div className="flex flex-col gap-3	">
										<div className="flex gap-4">
											<strong className="text-white">Type:</strong>
											<div className="flex flex-wrap gap-x-2 gap-y-1">
												<Controller
													name="type"
													control={form.control}
													render={({ field }) => (
														<>
															<label htmlFor="type-any" className="flex items-center gap-1">
																<input
																	type="checkbox"
																	value="any"
																	id="type-any"
																	checked={field.value?.includes('any')}
																	onChange={(e) => {
																		const isChecked = e.target.checked;
																		if (isChecked) {
																			form.setValue('type', ['any']);  // Reset to only "any"
																		} else {
																			const updatedValue = field.value.filter((v: string) => v !== 'any');
																			field.onChange(updatedValue);
																		}
																	}}
																	disabled={form.formState.isLoading || form.formState.isSubmitting || form.formState.disabled}
																	className="disabled:opacity-75 disabled:cursor-not-allowed disabled:pointer-events-none"
																/>
																<span className="text-white">Any</span>
															</label>

															<label htmlFor="type-tv" className="flex items-center gap-1">
																<input
																	type="checkbox"
																	value="tv"
																	id="type-tv"
																	checked={field.value?.includes('tv')}
																	onChange={(e) => {
																		const updatedValue = e.target.checked
																			? [...field.value, e.target.value]
																			: field.value.filter((v: string) => v !== e.target.value);

																		if (e.target.checked && field.value.includes('any')) {
																			form.setValue('type', updatedValue.filter((v: string) => v !== 'any'));
																		} else {
																			field.onChange(updatedValue);
																		}
																	}}
																	disabled={form.formState.isLoading || form.formState.isSubmitting || form.formState.disabled}
																	className="disabled:opacity-75 disabled:cursor-not-allowed disabled:pointer-events-none"
																/>
																<span className="text-white">TV</span>
															</label>

															<label htmlFor="type-ova" className="flex items-center gap-1">
																<input
																	type="checkbox"
																	value="ova"
																	id="type-ova"
																	checked={field.value?.includes('ova')}
																	onChange={(e) => {
																		const updatedValue = e.target.checked
																			? [...field.value, e.target.value]
																			: field.value.filter((v: string) => v !== e.target.value);

																		if (e.target.checked && field.value.includes('any')) {
																			form.setValue('type', updatedValue.filter((v: string) => v !== 'any'));
																		} else {
																			field.onChange(updatedValue);
																		}
																	}}
																	disabled={form.formState.isLoading || form.formState.isSubmitting || form.formState.disabled}
																	className="disabled:opacity-75 disabled:cursor-not-allowed disabled:pointer-events-none"
																/>
																<span className="text-white">OVA</span>
															</label>

															<label htmlFor="type-ona" className="flex items-center gap-1">
																<input
																	type="checkbox"
																	value="ona"
																	id="type-ona"
																	checked={field.value?.includes('ona')}
																	onChange={(e) => {
																		const updatedValue = e.target.checked
																			? [...field.value, e.target.value]
																			: field.value.filter((v: string) => v !== e.target.value);

																		if (e.target.checked && field.value.includes('any')) {
																			form.setValue('type', updatedValue.filter((v: string) => v !== 'any'));
																		} else {
																			field.onChange(updatedValue);
																		}
																	}}
																	disabled={form.formState.isLoading || form.formState.isSubmitting || form.formState.disabled}
																	className="disabled:opacity-75 disabled:cursor-not-allowed disabled:pointer-events-none"
																/>
																<span className="text-white">ONA</span>
															</label>

															<label htmlFor="type-movie" className="flex items-center gap-1">
																<input
																	type="checkbox"
																	value="movie"
																	id="type-movie"
																	checked={field.value?.includes('movie')}
																	onChange={(e) => {
																		const updatedValue = e.target.checked
																			? [...field.value, e.target.value]
																			: field.value.filter((v: string) => v !== e.target.value);

																		if (e.target.checked && field.value.includes('any')) {
																			form.setValue('type', updatedValue.filter((v: string) => v !== 'any'));
																		} else {
																			field.onChange(updatedValue);
																		}
																	}}
																	disabled={form.formState.isLoading || form.formState.isSubmitting || form.formState.disabled}
																	className="disabled:opacity-75 disabled:cursor-not-allowed disabled:pointer-events-none"
																/>
																<span className="text-white">Movie</span>
															</label>

															<label htmlFor="type-special" className="flex items-center gap-1">
																<input
																	type="checkbox"
																	value="special"
																	id="type-special"
																	checked={field.value?.includes('special')}
																	onChange={(e) => {
																		const updatedValue = e.target.checked
																			? [...field.value, e.target.value]
																			: field.value.filter((v: string) => v !== e.target.value);

																		if (e.target.checked && field.value.includes('any')) {
																			form.setValue('type', updatedValue.filter((v: string) => v !== 'any'));
																		} else {
																			field.onChange(updatedValue);
																		}
																	}}
																	disabled={form.formState.isLoading || form.formState.isSubmitting || form.formState.disabled}
																	className="disabled:opacity-75 disabled:cursor-not-allowed disabled:pointer-events-none"
																/>
																<span className="text-white">Special</span>
															</label>

															<label htmlFor="type-music" className="flex items-center gap-1">
																<input
																	type="checkbox"
																	value="music"
																	id="type-music"
																	checked={field.value?.includes('music')}
																	onChange={(e) => {
																		const updatedValue = e.target.checked
																			? [...field.value, e.target.value]
																			: field.value.filter((v: string) => v !== e.target.value);

																		if (e.target.checked && field.value.includes('any')) {
																			form.setValue('type', updatedValue.filter((v: string) => v !== 'any'));
																		} else {
																			field.onChange(updatedValue);
																		}
																	}}
																	disabled={form.formState.isLoading || form.formState.isSubmitting || form.formState.disabled}
																	className="disabled:opacity-75 disabled:cursor-not-allowed disabled:pointer-events-none"
																/>
																<span className="text-white">Music</span>
															</label>
														</>
													)}
												/>
											</div>
										</div>
										<div className="flex gap-4">
											<strong className="text-white">Status:</strong>
											<div className="flex flex-wrap gap-x-2 gap-y-1">
												<Controller
													name="status"
													control={form.control}
													render={({ field }) => (
														<>
															<label htmlFor="status-any" className="flex items-center gap-1">
																<input
																	type="checkbox"
																	value="any"
																	id="status-any"
																	checked={field.value?.includes('any')}
																	onChange={(e) => {
																		const isChecked = e.target.checked;
																		if (isChecked) {
																			form.setValue('status', ['any']);  // Reset to only "any"
																		} else {
																			const updatedValue = field.value.filter((v: string) => v !== 'any');
																			field.onChange(updatedValue);
																		}
																	}}
																	disabled={form.formState.isLoading || form.formState.isSubmitting || form.formState.disabled}
																	className="disabled:opacity-75 disabled:cursor-not-allowed disabled:pointer-events-none"
																/>
																<span className="text-white">Any</span>
															</label>

															<label htmlFor="status-plan_to_watch" className="flex items-center gap-1">
																<input
																	type="checkbox"
																	value="plan_to_watch"
																	id="status-plan_to_watch"
																	checked={field.value?.includes('plan_to_watch')}
																	onChange={(e) => {
																		const updatedValue = e.target.checked
																			? [...field.value, e.target.value]
																			: field.value.filter((v: string) => v !== e.target.value);

																		if (e.target.checked && field.value.includes('any')) {
																			form.setValue('status', updatedValue.filter((v: string) => v !== 'any'));
																		} else {
																			field.onChange(updatedValue);
																		}
																	}}
																	disabled={form.formState.isLoading || form.formState.isSubmitting || form.formState.disabled}
																	className="disabled:opacity-75 disabled:cursor-not-allowed disabled:pointer-events-none"
																/>
																<span className="text-white">Plan to watch</span>
															</label>

															<label htmlFor="status-on_hold" className="flex items-center gap-1">
																<input
																	type="checkbox"
																	value="on_hold"
																	id="status-on_hold"
																	checked={field.value?.includes('on_hold')}
																	onChange={(e) => {
																		const updatedValue = e.target.checked
																			? [...field.value, e.target.value]
																			: field.value.filter((v: string) => v !== e.target.value);

																		if (e.target.checked && field.value.includes('any')) {
																			form.setValue('status', updatedValue.filter((v: string) => v !== 'any'));
																		} else {
																			field.onChange(updatedValue);
																		}
																	}}
																	disabled={form.formState.isLoading || form.formState.isSubmitting || form.formState.disabled}
																	className="disabled:opacity-75 disabled:cursor-not-allowed disabled:pointer-events-none"
																/>
																<span className="text-white">On hold</span>
															</label>

															<label htmlFor="status-watching" className="flex items-center gap-1">
																<input
																	type="checkbox"
																	value="watching"
																	id="status-watching"
																	checked={field.value?.includes('watching')}
																	onChange={(e) => {
																		const updatedValue = e.target.checked
																			? [...field.value, e.target.value]
																			: field.value.filter((v: string) => v !== e.target.value);

																		if (e.target.checked && field.value.includes('any')) {
																			form.setValue('status', updatedValue.filter((v: string) => v !== 'any'));
																		} else {
																			field.onChange(updatedValue);
																		}
																	}}
																	disabled={form.formState.isLoading || form.formState.isSubmitting || form.formState.disabled}
																	className="disabled:opacity-75 disabled:cursor-not-allowed disabled:pointer-events-none"
																/>
																<span className="text-white">Watching</span>
															</label>

															<label htmlFor="status-completed" className="flex items-center gap-1">
																<input
																	type="checkbox"
																	value="completed"
																	id="status-completed"
																	checked={field.value?.includes('completed')}
																	onChange={(e) => {
																		const updatedValue = e.target.checked
																			? [...field.value, e.target.value]
																			: field.value.filter((v: string) => v !== e.target.value);

																		if (e.target.checked && field.value.includes('any')) {
																			form.setValue('status', updatedValue.filter((v: string) => v !== 'any'));
																		} else {
																			field.onChange(updatedValue);
																		}
																	}}
																	disabled={form.formState.isLoading || form.formState.isSubmitting || form.formState.disabled}
																	className="disabled:opacity-75 disabled:cursor-not-allowed disabled:pointer-events-none"
																/>
																<span className="text-white">Completed</span>
															</label>

															<label htmlFor="status-dropped" className="flex items-center gap-1">
																<input
																	type="checkbox"
																	value="dropped"
																	id="status-dropped"
																	checked={field.value?.includes('dropped')}
																	onChange={(e) => {
																		const updatedValue = e.target.checked
																			? [...field.value, e.target.value]
																			: field.value.filter((v: string) => v !== e.target.value);

																		if (e.target.checked && field.value.includes('any')) {
																			form.setValue('status', updatedValue.filter((v: string) => v !== 'any'));
																		} else {
																			field.onChange(updatedValue);
																		}
																	}}
																	disabled={form.formState.isLoading || form.formState.isSubmitting || form.formState.disabled}
																	className="disabled:opacity-75 disabled:cursor-not-allowed disabled:pointer-events-none"
																/>
																<span className="text-white">Dropped</span>
															</label>
														</>
													)}
												/>
											</div>
										</div>
									</div>
								</form>
							</FormProvider>
						</div>
					</div>
				</main>

				<footer className="flex justify-center mt-auto px-3 lg:px-8 py-8">
					<p className="text-white text-sm">Created by <strong>Breakerino</strong>.</p>
				</footer>
			</div>
		</>
	);
};

export default Homepage;