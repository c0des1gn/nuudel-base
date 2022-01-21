import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    maxWidth: '100%',
    maxHeight: 45,
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 2,
    backgroundColor: 'transparent',
  },
  item: {
    marginTop: 10,
    height: 25,
    alignItems: 'center',
    flex: 0.5,
  },
});
