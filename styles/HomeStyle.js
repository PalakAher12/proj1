import { StyleSheet } from 'react-native'
import React from 'react'


const HomeStyle = StyleSheet.create({

  main: {
    flex: 1,
    backgroundColor: "white",
    padding: 5
  },
  profile_icon: {
    position: "absolute",
    top: -16,
    right: 0,
    marginRight: 2
  },
  profile_name: {
    flex: 1,
  },
  Topbar: {
    flexDirection: "row",
    margin: 12,
    marginTop: 20,
    
  },


  // icon in circle facility provided
  facility: {
    flexDirection: 'row',
    gap: 25,
    padding: 16,
    alignItems: 'center'
  },
  fac_iconCnt: {
    backgroundColor: "#d6f0fa",
    borderRadius: 16,
    alignItems: 'center',
    height: 60,
    width: 60,
    justifyContent: "center",
    marginBottom: 6,
    elevation: 2,

  },
  fac_iconCode: {
    backgroundColor: "#FFF1D6",
    borderRadius: 16,
    alignItems: 'center',
    height: 60,
    width: 60,
    justifyContent: "center",
    marginBottom: 6,
    elevation: 2,

  },
  fac_iconRep: {
    backgroundColor: "#D1F8FB",
    borderRadius: 16,
    alignItems: 'center',
    height: 60,
    width: 60,
    justifyContent: "center",
    marginBottom: 6,
    elevation: 2,

  },
  fac_iconId: {
    backgroundColor: "#F8E7EC",
    borderRadius: 16,
    alignItems: 'center',
    height: 60,
    width: 60,
    justifyContent: "center",
    marginBottom: 6,
    elevation: 2,

  },
  fac_singleIcon: {
    alignItems: 'center'
  },


// steps procress style
    card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: "95%",
    marginLeft:10,
    marginTop:20,
    elevation:3
  },
  title: {
    color: 'black',
    fontSize: 16,
    fontWeight: '600',
  },
  subtitle: {
    color: '#1b47d2',
    fontSize: 12,
  },
  percent: {
    color: '#1b47d2',
    fontSize: 12,
    fontWeight:'bold'
  },

  /* Dailycheckout 4 cards */
container: {
  padding: 7,
  flex: 1,
},

row: {
  flexDirection: 'row',
  justifyContent: 'center', // centers items in row
},

})
export default HomeStyle
