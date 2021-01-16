import React, {useRef, useState} from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import RBSheet from 'react-native-raw-bottom-sheet';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';

import CustomeIcon from '../../components/CustomeIcon';
import Button from '../../components/Button';
import colors from '../../constants/colors';
import ApplicationStyles from '../../constants/styles';
import {AuthContext} from "../../store/user/userStore";
import client from "../../api/client";

import * as orderModels from '../../integration/api_orders_v1.0_order_byproductowner_{productownerid}_GET_Rs';
import {defaultState} from '../../store/orders/ordersStore';
import {OrdersActionType, ordersReducer} from "../../store/orders/ordersReducer";


const ORDERS = [
  {
    id: '№2337',
    status: 'Сборка заказа',
    company: 'ООО Курочка Ряба',
    price: '1 200₽',
  },
  {
    id: '№2336',
    status: 'Собран',
    company: 'ООО Курочка Ряба',
    price: '1 200₽',
  },
  {
    id: '№2338',
    status: 'Отгрузка',
    company: 'ООО Курочка Ряба',
    price: '1 200₽',
  },
  {
    id: '№1211',
    status: 'Отменен',
    company: 'ООО Курочка Ряба',
    price: '1 500₽',
  },
];

const ORDERS2 = [
  {
    id: '№2331',
    status: 'Сборка заказа',
    company: 'ООО Курочка Ряба',
    price: '1 200₽',
  },
  {
    id: '№2332',
    status: 'Собран',
    company: 'ООО Курочка Ряба',
    price: '1 200₽',
  },
];

interface OrdersScreenProps {
  empty?: boolean;
  noPaymentConnection?: boolean;
}
interface OrderDemo {
    id: string;
    status: string;
    company: string;
    price: string;
}

const { height, width } = Dimensions.get('window');

const OrdersScreen = ({ empty, noPaymentConnection }: OrdersScreenProps) => {
    const { state: authState } = React.useContext(AuthContext);
    const ownerId = authState.user['http://______market.ru/claims/accountid'];
    console.log('ownerId=', ownerId);

    const [state, dispatch] = React.useReducer(ordersReducer, defaultState);
    console.log('orders state=', state);

    const navigation = useNavigation();

    React.useEffect(() => {
        loadOrders(ownerId);
    }, []);

    const [items, setItems] = useState(ORDERS);

  const refNewOrderRB = useRef();
  const refNoPaymentConnectionRB = useRef();

  const loadOrders = (ownerid: string) => {
      let loadDemoData = false; // if true demo data will be loaded
      client
          .get(`/api/orders/v1.0/order/byproductowner/${ownerid}`)
          .then((res) => {
              if (res.ok) {
                  const orders: orderModels.IMain = res.data;
              } else {
                  console.error(`loadOrders failed with status ${res.status}`);
/*
                  dispatch({
                      type: OrdersActionType.SET_ORDERS,
                      payload: {orders: []},
                  });
*/
                  loadDemoData = false;
              }

              if (loadDemoData) {

                  const demoOrders: orderModels.IOrder = [];
                  for (const demo of ORDERS) {
                      demoOrders.push(convertDemoData("2020-11-16", demo));
                  }
                  for (const demo of ORDERS2) {
                      demoOrders.push(convertDemoData("2020-11-15", demo));
                  }
                  dispatch({
                      type: OrdersActionType.SET_ORDERS,
                      payload: {"orders": demoOrders},
                  });

              }

          })
          .catch((err) => {
              console.log('fetchAccount err:', JSON.stringify(err));
          });
  }

  const convertDemoData = (date: string, demoOrder: OrderDemo): orderModels.IOrder => {
      const defaultOrder: orderModels.IDataItem = {
          ownerId,
          itemsCount: 0,
          totalSum: 0,
          changedDate: "2020-11-26T08:40:39.376Z",
          createdDate: "2020-11-26T08:40:39.375Z",
          simpleStatus: {},
          changedById: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          currency: {},
          id: uuidv4(),
          paymentStatus: {},
          deliveryStatus: {},
          status: {},
      };
      return {...defaultOrder,
            ...{
                createdDate: date,
                buyerName: demoOrder.company,
                status: {value: demoOrder.status},
                price: demoOrder.price
            }
      }
  }

    const uuidv4 = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

  const renderItem = ({ item }) => {
    return (
      <View key={item.id}
        style={{
          flexDirection: 'row',
          padding: 15,
          borderRadius: 10,
          backgroundColor: '#F8F9FD',
          marginBottom: 15,
        }}
      >
        <CustomeIcon
          name='order-fill'
          style={{ marginRight: 10 }}
          color={item.status === 'Отменен' ? colors.gray : colors.primary}
          size={18}
        />
        <View style={{ flex: 1 }}>
          <Text
            style={{
              marginBottom: 5,
              marginTop: 2,
              color: colors.dark,
              fontSize: 14,
              lineHeight: 15,
              fontWeight: '500',
            }}
          >
            {item.id}
          </Text>
          <Text
            style={{
              marginBottom: 5,
              color: item.status.value === 'Отменен' ? colors.gray : colors.primary,
              fontSize: 12,
              lineHeight: 20,
              fontWeight: '500',
            }}
          >
            {item.status.value}
          </Text>
          <Text
            style={{
              marginBottom: 5,
              color: colors.gray,
              fontSize: 12,
              lineHeight: 16.8,
              fontWeight: '400',
            }}
          >
            {item.buyerName}
          </Text>
        </View>
        <View>
          <Text
            style={{
              color: colors.gray,
              fontWeight: '700',
              fontSize: 14,
              lineHeight: 16.71,
            }}
          >
            {item.price}
          </Text>
        </View>
      </View>
    );
  };

  const renderScanQRScreen = () => {
    return (
      <View style={{ flex: 1, marginHorizontal: 20 }}>
        <View style={{ marginBottom: 25 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
              lineHeight: 21.48,
              color: colors.dark,
            }}
          >
            Поднесите QR-код покупателя
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Image
            style={{ borderRadius: 15, height: '100%', width: '100%' }}
            source={require('../../../assets/qr-bg.png')}
          />
          <View style={[ApplicationStyles.absoluteCenter, { zIndex: 10 }]}>
            <Image source={require('../../../assets/qr-border.png')} />
          </View>
        </View>

        <View
          style={{
            marginBottom: 35,
            marginTop: 25,
            zIndex: 100,
          }}
        >
          <Button
            active={true}
            containerStyle={{ backgroundColor: 'rgba(32, 81, 163, 0.05)' }}
            textStyle={{ color: colors.primary }}
            text='Отмена'
            onPress={() => {
              refNewOrderRB.current.close();
            }}
          />
        </View>
      </View>
    );
  };


    const renderOrderList = (orders) => {
        const ordersByDate = [];
        let dateOrders: {date:string, orders: any[]} = {date: '', orders: []};
        let oldDate = '';
        for (const order of orders) {
            const dateObject = new Date(order.createdDate);
            const curDate = moment(dateObject).format('DD MMMM');
            if (oldDate !== curDate) {
                if (oldDate) {
                    ordersByDate.push(dateOrders);
                }
                oldDate = curDate;
                dateOrders = {date: curDate, orders: []};
            }
            dateOrders.orders.push(order);
        }
        if (dateOrders.date) {
            ordersByDate.push(dateOrders)
        }
        console.log('ordersByDate - '+ordersByDate.length);
        console.log(dateOrders.orders);
        return (
            <>
                {ordersByDate.map((dateOrders) => {
                    return (
                        <>
                            <RenderOrderDayList date={dateOrders.date} dayOrders={dateOrders.orders} />
                        </>
                    );
                })}
            </>
        );
    }

    const RenderOrderDayList = ({date, dayOrders}) => {
        return (
            <>
                <View style={{ marginHorizontal: 20, marginBottom: 15 }}>
                    <Text style={styles.productCountText}>{date}</Text>
                </View>
                <FlatList
                    contentContainerStyle={{
                        marginHorizontal: 20,
                        // backgroundColor: 'red',
                        paddingBottom: 10,
                    }}
                    showsVerticalScrollIndicator={false}
                    data={dayOrders}
                    renderItem={renderItem}
                />
            </>
        );
    }


    return (
    <SafeAreaView style={ApplicationStyles.flex}>
      <View
        style={{
          marginHorizontal: 20,
          flexDirection: 'row',
          marginVertical: 20,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text style={styles.pageTitle}>Заказы</Text>
        <View style={styles.headerRightIconContainer}>
          <Text style={styles.helpText}>Помощь</Text>
          <CustomeIcon
            name='help'
            size={18}
            color={colors.primary}
            style={styles.helpIcon}
          />
        </View>
      </View>

            {state.orders.length ? (
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
            {renderOrderList(state.orders)}
         </ScrollView>
      ) : (
        <View style={[ApplicationStyles.absoluteCenter, { zIndex: -1 }]}>
          <View
            style={{
              flex: 1,
              marginHorizontal: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Image source={require('../../../assets/no-data.png')} />
            <Text style={styles.noDataTitle}>В заказах пока ничего нет</Text>
            <Text style={styles.noDataContent}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Egestas
              fermentum euismod non gravida est maecenas enim
            </Text>
          </View>
        </View>
      )}
      <View style={[styles.actionContainer, styles.shadow]}>
        <Button
          active={true}
          text='Новый заказ'
          onPress={() => {
              navigation.navigate("ScanQR");
          }}
        />
      </View>
      <RBSheet
        ref={refNewOrderRB}
        closeOnDragDown={true}
        closeOnPressMask={true}
        height={height}
        customStyles={{
          wrapper: {},
          draggableIcon: {
            backgroundColor: '#D2DCED',
            height: 3,
            width: 40,
            marginVertical: 20,
          },
          container: {
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
          },
        }}
      >
        {renderScanQRScreen()}
      </RBSheet>
      <RBSheet
        ref={refNoPaymentConnectionRB}
        closeOnDragDown={true}
        closeOnPressMask={true}
        height={425}
        customStyles={{
          wrapper: {},
          draggableIcon: {
            backgroundColor: '#D2DCED',
            height: 3,
            width: 40,
            marginVertical: 20,
          },
          container: {
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
          },
        }}
      >
        <View style={{ marginHorizontal: 20 }}>
          <Image
            style={{ borderRadius: 15, alignSelf: 'center' }}
            source={require('../../../assets/payments/payment-connect.png')}
          />
          <Text
            style={{
              marginVertical: 20,
              fontWeight: '400',
              lineHeight: 16.71,
              fontSize: 14,
              color: colors.gray,
            }}
          >
            Для работы с заказами через приложение, необходимо подключить
            систему платежей
          </Text>
          <View style={{}}>
            <Button
              active={true}
              text='Подключить'
              onPress={() => {
                alert('Подключить');
              }}
            />
            <TouchableOpacity
              style={styles.resetContainer}
              onPress={() => {
                refNoPaymentConnectionRB.current.close();
              }}
            >
              <Text style={styles.resetText}>Отмена</Text>
            </TouchableOpacity>
          </View>
        </View>
      </RBSheet>
    </SafeAreaView>
  );
};

export default OrdersScreen;

const styles = StyleSheet.create({
  productCountText: {
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 14,
    color: colors.gray,
  },
  filterContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionContainer: {
    position: 'absolute',
    backgroundColor: '#fff',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 25,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  shadow: {
    shadowColor: 'rgba(37, 76, 140, 0.05)',
    shadowOffset: {
      width: -1,
      height: -16,
    },
    shadowOpacity: 1,
    shadowRadius: 30,

    ...Platform.select({
      android: {
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: 'rgba(32, 81, 163, 0.1)',
      },
    }),
  },
  noDataTitle: {
    fontSize: 16,
    lineHeight: 19,
    marginTop: 15,
    color: colors.dark,
    textAlign: 'center',
    ...Platform.select({
      ios: {
        fontWeight: '600',
      },
      android: {
        fontWeight: '700',
      },
    }),
  },
  noDataContent: {
    fontWeight: '400',
    fontSize: 13,
    lineHeight: 20,
    marginVertical: 15,
    color: colors.gray,
    textAlign: 'center',
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 26.25,
    color: colors.dark,
    letterSpacing: 0.41,
  },
  headerRightIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 18,
  },
  helpText: {
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    lineHeight: 17,
    color: colors.primary,
  },
  helpIcon: { marginLeft: 10 },
  topSpacer: {
    height: 3,
    width: 40,
    backgroundColor: colors.primary,
    opacity: 0.2,
    alignSelf: 'center',
    borderRadius: 5,
    marginVertical: 10,
  },
  resetContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 15,
  },
  resetText: {
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    fontSize: 14,
    lineHeight: 19,
    letterSpacing: -0.3,
    color: colors.primary,
  },
});
