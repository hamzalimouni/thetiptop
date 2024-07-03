import Header from "../../components/Header"
import { RandomReveal } from 'react-random-reveal'
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { useQuery } from "react-query";
import { User } from "../../types/types";
import { userRequest } from "../../makeRequest";
import { Button, Statistic, message } from "antd";
import { useState } from "react";
import { setConfigs } from "../../redux/reducers/configSlice";
const { Countdown } = Statistic;

const Game = () => {

	const { currentUser } = useAppSelector(state => state.auth);
	const [winner, setWinner] = useState<User | null>(null);
	const { dateOfValidate, status } = useAppSelector(state => state.config);
	const [isPlayed, setIsPlayed] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const dispatch = useAppDispatch();

	const { data: participants } = useQuery<User[]>(["participants"], async ({ signal }) => {
		const res = await userRequest.get(`users/winners`, {
			headers: {
				token: `Bearer ${currentUser?.token}`
			},
			signal
		});
		return res?.data;
	});

	const getRandomParticipant = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
		e.preventDefault();
		if (participants) {
			const randomIndex = Math.floor(Math.random() * participants?.length);
			setWinner(participants[randomIndex]);
			setTimeout(() => {
				setIsPlayed(true);
			}, 5000)
			console.log(participants[randomIndex])
		}
	};

	const handleSubmit = async (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			const res = await userRequest.post(`tickets/tirage`, {email: winner?.email}, {
				headers: {
					token: `Bearer ${currentUser?.token}`
				}
			});
			if(res.status === 201) {
				dispatch(setConfigs(res?.data));
				message.success("Le gagnant a été notifié par email");
			}
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<>
			<Header path={["Tableau de bord", "Jeux de gros lot"]} />
			<div className="my-12 px-4 md:px-8">
				<div className="items-start justify-between md:flex">
					<div className="max-w-lg">
						<h3 className="text-gray-800 text-xl font-bold sm:text-2xl">Jeu de gros lot</h3>
						<p className="text-gray-600 mt-2">Après la fin de la période de participation, vous pouvez jouer pour désigner le gagnant du gros lot.</p>
					</div>
				</div>
				<div className="flex flex-col justify-center items-center py-12">
					{
						new Date() < new Date(dateOfValidate) ? (
							<>
								<p className="text-red-600 font-bold text-xl">
									Le tirage au sort pour le grand lot n'est pas encore ouvert.
								</p>
								<span className="flex items-center gap-2 mt-2">
									<span>Fin de la période de participation </span>
									<Countdown className="flex items-center justify-center font-semibold" valueStyle={{ fontSize: 15 }} value={dateOfValidate} onFinish={() => alert("finished")} format="D[J] H[h] m[m] s[s]" />
								</span>
							</>
						) : 
						!status ? (
							<p className="text-red-600 font-bold text-xl">
								le tirage au sort pour le grand lot est terminé et le gagnant a été tiré au sort..
							</p>
						) : null
					}
					<div className={`${(new Date() < new Date(dateOfValidate) || !status) ? "pointer-events-none blur" : ""} mt-5 relative min-h-48 flex flex-col items-center rounded-[20px] w-[500px] mx-auto p-4 bg-white bg-clip-border shadow-3xl shadow-shadow-500`}>
						<div className="flex flex-col gap-8 items-center text-xl font-semibold text-[#333] py-4">
							<div className='mt-2 bg-gray-100 text-center p-3 font-bold text-xl font-[monospace]'>
								{
									winner ?
										<RandomReveal isPlaying duration={5} characters={`${winner?.firstname} ${winner?.lastname}`} />
										:
										"Le gagnant sera affiché ici"
								}
							</div>
							{
								isPlayed ?
									<div className="text-center">
										<Button loading={isLoading} onClick={handleSubmit} type="text" className="!text-white !bg-green-600 hover:!bg-green-700">
											Notifier le gagnant par email
										</Button>
										<p className="mt-2 text-[10px] d-block">Le gagnant sera notifié par email à l'adresse suivant <span className="font-bold text-[12px]">{winner?.email}</span></p>
									</div>
									:
									<Button loading={winner ? true : false} onClick={getRandomParticipant} type="text" className="bg-green-700 hover:!bg-green-800 !text-white">
										Commencer le tirage au sort
									</Button>
							}
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default Game