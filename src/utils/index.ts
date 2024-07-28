export const userScoreStrokeColor = (userScore: number) => {
	if (userScore >= 80) {
		return "green";
	} else if (userScore >= 50) {
		return "orange";
	} else {
		return "red";
	}
};
