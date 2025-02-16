//
import { Head, Link } from '@inertiajs/react';
import { AxiosError } from 'axios';
import { capitalize } from 'lodash';
import React from 'react';

import {
	FacebookIcon,
	FacebookShareButton,
	LineIcon,
	LineShareButton,
	RedditIcon,
	RedditShareButton,
	TelegramIcon,
	TelegramShareButton,
	TwitterShareButton,
	XIcon
} from "react-share";

//
//import { useApi } from '@/app/api';
import { ANIME_STATUS, ANIME_TYPES } from '@/app/constants';
import Icon from '@/components/Icon';
import Popover from '@/components/Popover';
import { PageProps } from '@/types';
import { formatNumber } from '@/utils/functions';

const User: React.FC<PageProps & { username: string, userMalLink: string, type: string, status: string, data: Record<string, any>, error: string }> = ({ username, userMalLink, type, status, data, error }) => {
	const formattedUsername = React.useMemo(() => capitalize(username), [username])

	return (
		<>
			<Head title={formattedUsername}>
				{data && <meta name="description" content={`${formattedUsername} has spent a total of ${formatNumber(data?.stats?.total_days)} days watching anime, which equals ${formatNumber(data?.stats?.total_hours)} hours or ${formatNumber(data?.stats?.total_minutes)} minutes! ${formattedUsername} has watched ${formatNumber(data?.stats?.total_episodes)} episodes in total.`} />}
			</Head>

			<div className="min-h-[100vh] h-full flex flex-col">
				<main className="w-full h-full flex-1 max-w-7xl mx-auto px-3 py-12 md:p-6 md:py-20 lg:px-8 flex items-center flex-col">
					<div className="w-full flex gap-4 lg:gap-8 flex-col items-center md:flex-row lg:justify-between">
						<Link href="/" aria-label="Go to homepage">
							<h1 className="w-fit h-fit flex flex-col text-center md:text-left text-white">
								<span className="text-xl sm:text-3xl lg:text-5xl font-semibold uppercase">Time Spent on&nbsp;</span>
								<span className="text-6xl sm:text-8xl lg:text-9xl font-bold uppercase text-transparent bg-clip-text inline-block bg-gradient-primary -mt-2">Anime</span>
							</h1>
						</Link>
						<div className="w-full flex md:flex-col gap-3 md:gap-1 lg:gap-2 items-center justify-between md:items-end flex-wrap sm:flex-auto">
							{data && (
								<Popover
									className="self-end mr-auto md:mr-0 md:self-end order-1 md:order-none"
									content={
										<div className="flex flex-row gap-1">
											<FacebookShareButton url={window.location.href} openShareDialogOnClick={true} title={`Time Spent on Anime - ${formattedUsername}`} className="!p-2 hover:!bg-slate-200">
												<FacebookIcon size={32} round />
											</FacebookShareButton>
											<TwitterShareButton url={window.location.href} openShareDialogOnClick={true} title={`Time Spent on Anime - ${formattedUsername}`} className="!p-2 hover:!bg-slate-200">
												<XIcon size={32} round />
											</TwitterShareButton>
											<RedditShareButton url={window.location.href} openShareDialogOnClick={true} title={`Time Spent on Anime - ${formattedUsername}`} className="!p-2 hover:!bg-slate-200">
												<RedditIcon size={32} round />
											</RedditShareButton>
											<TelegramShareButton url={window.location.href} openShareDialogOnClick={true} title={`Time Spent on Anime - ${formattedUsername}`} className="!p-2 hover:!bg-slate-200">
												<TelegramIcon size={32} round />
											</TelegramShareButton>
											<LineShareButton url={window.location.href} openShareDialogOnClick={true} title={`Time Spent on Anime - ${formattedUsername}`} className="!p-2 hover:!bg-slate-200">
												<LineIcon size={32} round />
											</LineShareButton>
										</div>
									}
								>
									<button className="flex items-center justify-center bg-gradient-primary w-8 h-8 rounded-full bg-[length:125%] bg-[position:75%] hover:bg-[position:0%] transition-background duration-300 ease-in-out" aria-label="Share on socials">
										<Icon id="general.share" color="white" className="w-4 h-4 cursor-pointer" />
									</button>
								</Popover>
							)}

							<div className="text-left md:text-right md:mt-0 lg:mt-5 order-0 md:order-none">
								<span className="text-white text-md">Profile</span>
								<a className="block" href={userMalLink} target="_blank" rel="noreferrer" aria-label={`View ${formattedUsername}'s profile on MyAnimeList`}>
									<h2 className="text-4xl lg:text-5xl text-white font-semibold break-all">
										{formattedUsername}
									</h2>
								</a>
							</div>
							<div className="w-full md:w-fit flex xs:flex-col text-white gap-x-2 gap-y-1 text-sm text-left md:text-right order-2 md:order-none">
								<div>
									<strong>Type:&nbsp;</strong>
									<span>{type.split(',').map(t => ANIME_TYPES[t.trim() as keyof typeof ANIME_TYPES]).join(', ')}</span>
								</div>
								<div>
									<strong>Status:&nbsp;</strong>
									<span>{status.split(',').map(s => ANIME_STATUS[s.trim() as keyof typeof ANIME_STATUS]).join(', ')}</span>
								</div>
							</div>
						</div>
					</div>

					{!data
						? (!error ? (
							<div className="w-full h-full flex flex-1 items-center justify-center">
								<span className="spinner"></span>
							</div>
						) : (
							<div className="w-full h-full flex flex-1 items-center justify-center">
								<span className="text-white text-xl">{error}</span>
							</div>
						))
						: (
							<div className="w-full flex flex-col gap-4 mt-10 sm:mt-12 lg:mt-20">
								<div>
									<h2 className="text-white text-2xl md:text-3xl font-medium">Stats</h2>
									<div className="mt-6 grid gap-4 grid-cols-2 md:grid-cols-4">
										<div className="bg-white shadow-md p-4 md:p-8 rounded-md flex flex-col">
											<span className="text-sm md:text-[1rem]">Total episodes</span>
											<strong className="text-md sm:text-lg lg:text-2xl text-transparent bg-gradient-primary bg-clip-text w-fit">{formatNumber(data?.stats?.total_episodes)}</strong>
										</div>
										<div className="bg-white shadow-md p-4 md:p-8 rounded-md flex flex-col">
											<span className="text-sm md:text-[1rem]">Total minutes</span>
											<strong className="text-md sm:text-lg lg:text-2xl text-transparent bg-gradient-primary bg-clip-text w-fit">{formatNumber(data?.stats?.total_minutes)}</strong>
										</div>
										<div className="bg-white shadow-md p-4 md:p-8 rounded-md flex flex-col">
											<span className="text-sm md:text-[1rem]">Total hours</span>
											<strong className="text-md sm:text-lg lg:text-2xl text-transparent bg-gradient-primary bg-clip-text w-fit">{formatNumber(data?.stats?.total_hours)}</strong>
										</div>
										<div className="bg-white shadow-md p-4 md:p-8 rounded-md flex flex-col">
											<span className="text-sm md:text-[1rem]">Total days</span>
											<strong className="text-md sm:text-lg lg:text-2xl text-transparent bg-gradient-primary bg-clip-text w-fit">{formatNumber(data?.stats?.total_days)}</strong>
										</div>
									</div>
								</div>
								{data?.animes?.length > 0 && (
									<div className="mt-8">
										<h2 className="text-white text-2xl md:text-3xl font-medium">Animes ({data.animes.length})</h2>
										<div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
											{/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
											{data?.animes?.map?.((anime: Record<string, any>, index: number) => (
												<div key={anime.id} className="bg-white shadow-md rounded-md flex flex-col overflow-hidden">
													<div className="relative border-b border-gray-200 border-solid">
														<span className="absolute top-2 left-2 flex items-center justify-center shadow-md bg-gradient-primary text-white w-10 h-10 rounded-full text-md font-semibold leading-none">{index + 1}</span>
														<a href={anime.link} target="_blank" rel="noreferrer" aria-label={`View anime ${anime.name} on MyAnimeList`}>
															<img src={anime.image} alt={`Image of ${anime.name}`} loading={index < 7 ? 'eager' : 'lazy'} className="w-full bg-slate-100 sm:min-h-[68.5vw] sm:max-h-[68.5vw] lg:min-h-[45vw] lg:max-h-[45vw] xl:min-h-[27rem] xl:max-h-[27rem] object-cover object-center" />
														</a>
													</div>
													<div className="h-full py-3 px-4 flex flex-col gap-2 justify-between">
														<div className="h-full flex flex-col justify-between">
															<div className="flex flex-col gap-1">
																<span className="text-md font-semibold leading-5">{anime.name}</span>
																{(anime.english_name && anime.name !== anime.english_name) && <span className="text-xs text-gray-500">{anime.english_name}</span>}
															</div>
															<div className="flex items-center justify-between gap-1 mt-3">
																<span className="text-xs font-bold text-gray-700">{anime.type.name}</span>
																{['tv', 'ova', 'special', 'ona'].includes(anime.type.id) && anime.total_episodes !== 0 && <span className="ml-auto text-xs text-gray-600">{anime.watched_episodes} / {anime.total_episodes} episodes</span>}
																<span className="ml-auto text-xs font-bold text-gray-800">{anime.status.name}</span>
															</div>
														</div>
														<div className="flex flex-row gap-1 md:items-center justify-between border-t border-gray-200 pt-2">
															<span className="text-sm"><strong className="font-bold">{anime.stats.total_minutes}</strong> minutes</span>
															<span className="text-sm"><strong className="font-bold">{anime.stats.total_hours}</strong> hours</span>
															<span className="text-sm"><strong className="font-bold">{anime.stats.total_days}</strong> days</span>
														</div>
													</div>
												</div>
											))}
										</div>
									</div>
								)}
							</div>
						)}
				</main>

				<footer className="flex justify-center mt-auto py-8">
					<p className="text-white text-sm">Created by <strong>Breakerino</strong>.</p>
				</footer>
			</div>
		</>
	);
};

export default User;