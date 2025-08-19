import { StyleSheet } from 'react-native';


const styles = StyleSheet.create({
  wrapper1: {
    flex: 1,
    backgroundColor: '#F8F9FF', // soft lavender/blue base
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },
  icon: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1E',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    paddingHorizontal: 10,
    marginBottom: 28,
  },
  dots: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  dot: {
    width: 8,
    height: 8,
    backgroundColor: '#ddd',
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#1C75BC',
    width: 10,
    height: 10,
  },
  button: {
    backgroundColor: '#1C75BC',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  backButton: {
  position: 'absolute',
  top: 40,
  left: 20,
  flexDirection: 'row',
  alignItems: 'center',
  zIndex: 10,
},
backText: {
  fontSize: 28,
  color: '#1C75BC',
  marginLeft: 6,
  fontWeight: '500',
},

});

export default styles;