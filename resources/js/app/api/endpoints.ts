import { EndpointsArgs } from '.';

type EndpointName = 'retrieveReport';

const endpoints: Record<EndpointName, EndpointsArgs> = {
	retrieveReport: {
		url: '/report/:username/retrieve',
		method: 'GET',
		access: 'public',
		data: {
			username: '',
		},
	},
};

export default endpoints;