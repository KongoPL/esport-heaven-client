import React from 'react';
import SubpageBox from 'components/SubpageBox';
import TwitchTransmission from "components/TwitchTransmission";
import 'scss/pages/game.scss';
import Api from "../../Api";
import {IUpcomingGame} from "../../DataTypes";


export default class Game extends React.Component<{id: number}, {match: IUpcomingGame | null}>
{
	constructor(props: any)
	{
		super(props);

		this.state = {
			match: null
		};

		Api.getMatchById(this.props.id).then((match) => this.setState({match}));
	}

	componentDidUpdate(prevProps: Readonly<{ id: number }>, prevState: Readonly<{ match: IUpcomingGame }>, snapshot?: any): void
	{
		if(this.props.id != prevProps.id)
		{
			Api.getMatchById(this.props.id).then((match) => this.setState({match}));
		}
	}

	render()
	{
		if(!this.state.match)
			return null;

		const match = this.state.match;

		return <SubpageBox>
			<h2>{match.title}</h2>
			<section className="game-overview">
				<h3>Game's overview</h3>
				<GameOverview {...match}/>
			</section>
			<section className="transmission">
				<h3>Match transmission</h3>
				<TwitchTransmission channelName={match.transmissionChannelId}/>
			</section>
		</SubpageBox>;
	}
}


function GameOverview(match: IUpcomingGame)
{
	return <div className="game-overview">
		<div className="teams-score">
			<TeamDescription name={match.teamA.name} image={match.teamA.imageUrl} className="team-a" />
			<TeamDescription name={match.teamB.name} image={match.teamB.imageUrl} className="team-b" />
			<div className="score">
				{match.teamAScore} : {match.teamBScore}
			</div>
		</div>
		<div className="maps">
			{match.maps.map((v, i) =>
				<div key={i} className={`map${'winnerTeam' in v ? (v.winnerTeam == match.teamAId ? ' left' : ' right') : ''}`}>
					<span className="text">{v.data.name}</span>
				</div>
			)}
		</div>
	</div>;
}

function TeamDescription(props: {name: string, image: string, className?: string})
{
	return <div className={`team-description ${props.className}`}>
		<div className="image">
			<img src={props.image} alt="team-logo" />
		</div>
		<div className="name">
			{props.name}
		</div>
	</div>;
}
