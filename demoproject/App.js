import { FlatList, SafeAreaView, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios';


const App = () => {
  const [activeTab, setActiveTab] = useState(1)
  const [purchasedService, setPurchasedService] = useState([])
  const [additionalService, setAdditionalService] = useState([])


  useEffect(() => {
    getServiceList()
  }, [])


  async function getServiceList() {
    axios({
      method: "GET",
      url: "https://fir-dynamiclinks-e43dd.web.app/practical-api.json",
    })
      .then(response => {
        // console.log('SUCCESS RESPONSE: ', JSON.stringify(response?.data?.data?.purchased_services));
        filterData(response?.data?.data?.purchased_services)
      })
      .catch(function (error) {
        console.log('ERROR RESPONSE: ', JSON.stringify(error));

      });
  }



  function filterData(arrData) {

    var arrOfSservice_selected_Additional = []
    var arrOfSservice_selected_purchased = []


    for (i in arrData) {
      let mainObj = arrData[i]

      let arrPurchased_office_services = mainObj?.purchased_office_template?.purchased_office_services

      for (index in arrPurchased_office_services) {

        let purchased_office_services = arrPurchased_office_services[index]

        if ((purchased_office_services?.service_selected) == null) {
          arrOfSservice_selected_Additional?.push(purchased_office_services)
        } else {
          arrOfSservice_selected_purchased?.push(purchased_office_services)
        }

      }
    }

    setAdditionalService(arrOfSservice_selected_Additional)
    setPurchasedService(arrOfSservice_selected_purchased)

  }


  function getTotalPrice() {
    let totalPrice = 0;
    for (let i = 0; i < purchasedService.length; i++) {
      const price = parseFloat(purchasedService[i].price);
      totalPrice += price;
    }
    return totalPrice
  }




  return (

    <View style={{ backgroundColor: 'white', flex: 1 }}>
      <SafeAreaView />

      <Text style={styles.titltxt}>Services</Text>
      <View style={styles.topTabView}>
        <TouchableOpacity activeOpacity={0.7} onPress={() => setActiveTab(1)} style={[styles.tabView, { borderBottomColor: activeTab == "1" ? "#FFD700" : "#FFD70050", }]}>
          <Text style={styles.tabTxt}>PURCHASED SERVICES</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.7} onPress={() => setActiveTab(2)} style={[styles.tabView, { borderBottomColor: activeTab == "2" ? "#FFD700" : "#FFD70050", }]}>
          <Text style={styles.tabTxt}>ADDITIONAL SERVICES</Text>
        </TouchableOpacity>
      </View>


      <FlatList
        data={activeTab == 1 ? purchasedService : additionalService}
        renderItem={(item) => {
          let val = item?.item
          // console.log("totall --- >", val?.price);

          return (
            <View style={{ paddingHorizontal: 10 }}>

              <Text style={styles.cellTitleTxt}>Main Service {item?.index + 1} : </Text>
              <View style={styles.cellView}>
                <Image
                  source={{ uri: val?.image }}
                  style={styles.imageView}
                />
                <View>
                  <Text style={styles.cellTxt}>{val?.name}</Text>
                  <Text style={styles.cellTxt2}>Kr {val?.price},-</Text>

                </View>
              </View>
            </View>
          )
        }}
        ListFooterComponent={() => {
          return (
            <View style={{ height: 30 }} />
          );
        }}
      />
      {
        activeTab == 1 ?
          <View style={styles.bottomView}>
            <Text style={styles.cellTxt}>Total costing : </Text>
            <Text style={styles.cellTxt}>Kr {getTotalPrice()},- </Text>
          </View>
          :
          null
      }
    </View>

  )
}

export default App

const styles = StyleSheet.create({
  titltxt: {
    fontSize: 28,
    color: 'black',
    fontWeight: '700',
    paddingLeft: 20
  },
  topTabView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tabView: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 3,
    // borderBottomColor: '#FFD70050',
    width: '50%',
  },
  tabTxt: {
    fontSize: 14,
    color: 'black',
    fontWeight: '600',
  },
  cellTitleTxt: {
    fontSize: 18,
    color: 'black',
    fontWeight: '600',
    marginBottom: 10,
    marginTop: 20
  },
  cellView: {
    paddingVertical: 10,
    width: '100%',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 6,
    alignItems: 'center',
    paddingHorizontal: 8
  },
  imageView: {
    height: 55,
    width: 55,
    borderRadius: 6,
    marginRight: 15
  },
  cellTxt: {
    fontSize: 17,
    color: 'black',
    fontWeight: '600',
  },
  cellTxt2: {
    fontSize: 15,
    color: 'black',
  },
  bottomView: {
    height: 80,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: '#907C09',

  }
})