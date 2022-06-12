import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
	container: {
		padding: 10,
		margin: 10,
		borderRadius: 10,
		Maxwidth: '75%',
	},
	leftcontainer: {
		backgroundColor: '#3777f0',
		marginLeft: 10,
		marginRight: 'auto',
	},
	rightcontainer: {
		backgroundColor: 'lightgray',
		marginLeft: 'auto',
		marginRight: 10,
		alignItems: 'flex-end',
	},
	messageReply:{
		backgroundColor: 'gray',
		padding: 5,
		borderRadius: 5,
	},
	row:{
		flexDirection: 'row',
		alignItems: 'flex-end'


	},
});

export default styles;