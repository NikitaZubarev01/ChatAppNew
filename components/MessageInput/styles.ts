import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
	root: {
		padding: 10,
	},
	inputContainer: {
		backgroundColor: 'lightgray',
		flex: 1,
		marginRight: 10,
		borderRadius: 25,
		borderWidth: 1,
		borderColor: 'lightgrey',
		alignItems: 'center',
		flexDirection: 'row',
		padding: 5,
	},
	row: {
		flexDirection: 'row',
	},
	buttonContainer: {
		width: 40,
		height: 40,
		backgroundColor: '#3777f0',
		borderRadius: 25,
		justifyContent: 'center',
		alignItems: 'center',
	},
	input: {
		flex: 1,
		marginHorizontal: 5,
	},
	icon: {
		marginHorizontal: 5,
	},
	buttonText: {
		color: 'white',
		fontSize: 25,
	},
	sendImageContainer: {
		flexDirection: 'row',
		marginVertical: 10,
		alignSelf: 'stretch',
		justifyContent: 'space-between',
		borderWidth: 1,
		borderColor: '#595959',
		borderRadius: 10,

	},
	sendAudioContainer: {
		marginVertical: 10,
		padding: 10,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		alignSelf: 'stretch',
		borderWidth: 1,
		borderColor: '#595959',
		borderRadius: 10,
	},
	audioProgressBG: {
		height: 5,
		flex: 1,
		backgroundColor: '#595959',
		borderRadius: 5,
		margin: 10,
	},
	audioProgressFG: {
		width: 10,
		height: 10,
		borderRadius: 10,
		backgroundColor: '#3777f0',


		position: 'absolute',
		top: -3,
	},
});

export default styles;