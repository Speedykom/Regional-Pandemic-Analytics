export interface Process {
    status: string;
	dags?: Array<any>;
	dag?: any;
}

export interface AirflowRuns {
	status: string;
	runs?: Array<any>;
}